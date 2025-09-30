import type {NextPage} from 'next'
import {Fragment} from 'react'
import {Header} from 'src/components'
import {MovieFinder} from 'src/components/MovieFinder'

const Home: NextPage = () => {
  return (
    <Fragment>
      <Header />
      <MovieFinder />
    </Fragment>
  )
}

export default Home
