import styles from "./style.module.css"

const Button = ({ label, onClick, disabled = false }) => {
  return (
    <button className={styles.btn} onClick={onClick} disabled={disabled}>
      {label}
    </button>
  )
}

export default Button
