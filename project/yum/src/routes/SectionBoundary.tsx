import { useRouteError } from 'react-router-dom'
/**
 * v1.0.3
 * @returns
 */
function SectionBoundary() {
  let error = useRouteError() as Error
  return (
    <>
      <h2>Error 💥</h2>
      <p>{error.message}</p>
    </>
  )
}

export default SectionBoundary
