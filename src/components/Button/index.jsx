import styles from "./style.module.css"

const Button = ({ label, onClick }) => {
  return (
    <button className={styles.btn} onClick={onClick}>
      {label}
    </button>
  )
}

export default Button
