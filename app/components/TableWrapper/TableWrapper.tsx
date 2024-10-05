import styles from './tableWrapper.module.css'

interface IProps {
  heading: string;
  subHeading: string;
  children: JSX.Element;
}

export const TableWrapper = ({
  heading,
  subHeading,
  children
}: IProps) => {
  return (
    <section>
      <div className={styles.heading}>
        <h2>{heading}</h2>
        <h4>{subHeading}</h4>
      </div>
      <div>
        {children}
      </div>
    </section>
  )
}