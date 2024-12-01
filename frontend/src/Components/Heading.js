import styles from "../Styles/heading.module.css"

const Heading = (props) => {
    return (
        <div className={styles.outerDiv}><h3>{props.text}</h3></div>
    )
}

export default Heading;