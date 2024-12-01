import pandas as pd
from fpdf import FPDF
import matplotlib.pyplot as plt
import os

# Define the function to generate a PDF from a CSV file and add graphs
def generate_pdf_with_graphs(csv_file_path, output_pdf_path):
    # Load the CSV file into a DataFrame
    try:
        df = pd.read_csv(csv_file_path)
    except Exception as e:
        print(f"Error reading CSV file: {e}")
        return
    
    # Convert 'date' column to a simple DD-MM-YYYY format and sort the data by date
    try:
        df['date'] = pd.to_datetime(df['date'])
        df['formatted_date'] = df['date'].dt.strftime('%d-%m-%Y')  # For tabular display
        df = df.sort_values(by='date')
    except KeyError:
        print("Error: 'date' column not found in the CSV file.")
        return

    # Filter data for the current year
    current_year = pd.Timestamp.now().year
    current_year_data = df[df['date'].dt.year == current_year]

    # Bar Graph: Monthly Expenses
    monthly_expenses = current_year_data.groupby(current_year_data['date'].dt.month)['amount'].sum()
    months = range(1, 13)
    expenses = [monthly_expenses.get(month, 0) for month in months]
    
    plt.figure(figsize=(10, 6))
    bars = plt.bar(months, expenses, color='skyblue')
    plt.title('Monthly Expenses for Current Year', fontsize=14)
    plt.xlabel('Month', fontsize=12)
    plt.ylabel('Expenses', fontsize=12)
    plt.xticks(months)
    for bar in bars:
        yval = bar.get_height()
        plt.text(bar.get_x() + bar.get_width() / 2, yval + 10, str(int(yval)), ha='center', fontsize=10)
    plt.tight_layout()
    bar_graph_path = "bar_graph.png"
    plt.savefig(bar_graph_path)
    plt.close()

    # Donut Chart: Category-wise Expenses
    category_expenses = df.groupby('category')['amount'].sum()
    labels = category_expenses.index
    sizes = category_expenses.values
    plt.figure(figsize=(8, 8))
    wedges, texts, autotexts = plt.pie(
        sizes,
        labels=labels,
        autopct='%1.1f%%',
        startangle=140,
        wedgeprops=dict(width=0.3)
    )
    plt.title('Expense Distribution by Category', fontsize=14)
    plt.tight_layout()
    donut_chart_path = "donut_chart.png"
    plt.savefig(donut_chart_path)
    plt.close()

    # Create a custom PDF class
    class PDF(FPDF):
        def header(self):
            self.set_font('Arial', 'B', 12)
            self.cell(0, 10, 'Expense Report (Sorted by Date)', border=0, ln=1, align='C')
            self.ln(10)

        def footer(self):
            self.set_y(-15)
            self.set_font('Arial', 'I', 8)
            self.cell(0, 10, f'Page {self.page_no()}', align='C')

        def add_table(self, df):
            # Set column widths
            col_widths = [20, 30, 40, 30, 60]

            # Add table headers
            self.set_font('Arial', 'B', 10)
            headers = ['amount', 'category', 'modeOfExpense', 'date', 'description']
            for i, header in enumerate(headers):
                self.cell(col_widths[i], 10, header, border=1, align='C')
            self.ln()

            # Add table rows
            self.set_font('Arial', '', 10)
            for _, row in df.iterrows():
                self.cell(col_widths[0], 10, str(row['amount']), border=1, align='C')
                self.cell(col_widths[1], 10, row['category'], border=1, align='C')
                self.cell(col_widths[2], 10, row['modeOfExpense'], border=1, align='C')
                self.cell(col_widths[3], 10, row['formatted_date'], border=1, align='C')
                self.cell(col_widths[4], 10, row['description'], border=1, align='C')
                self.ln()

        def add_graph(self, title, image_path):
            self.add_page()
            self.set_font('Arial', 'B', 12)
            self.cell(0, 10, title, ln=1, align='C')
            self.ln(10)
            self.image(image_path, x=10, y=None, w=190)

    # Generate the PDF
    pdf = PDF()
    pdf.set_auto_page_break(auto=True, margin=15)
    pdf.add_page()

    # Add the table to the PDF
    pdf.add_table(df)

    # Add Bar Graph
    pdf.add_graph('Bar Graph: Monthly Expenses', bar_graph_path)

    # Add Donut Chart
    pdf.add_graph('Donut Chart: Category-wise Expenses', donut_chart_path)

    # Save the PDF to the specified output path
    try:
        pdf.output(output_pdf_path)
        print(f"PDF saved as {output_pdf_path}")
    except Exception as e:
        print(f"Error saving PDF: {e}")

    # Clean up temporary image files
    try:
        os.remove(bar_graph_path)
        os.remove(donut_chart_path)
    except Exception as e:
        print(f"Error deleting temporary files: {e}")

# Specify the file paths
csv_file_path = "temp_expenses.csv"
output_pdf_path = "ExpensePDF.pdf"

# Call the function
generate_pdf_with_graphs(csv_file_path, output_pdf_path)