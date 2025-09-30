import Head from 'next/head'
import React, { Fragment } from 'react'

export function Header() {
  return (
    <Fragment>
      <Head>
        <title>Your Next Watch</title>
        <meta name="description" content="Find your next movie experience" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <header className="w-3/5 my-5 mx-auto text-center">
        <h1 className="bg-blue-600 text-white text-2xl font-semibold p-4 rounded">
          Your Next Watch
        </h1>
      </header>
    </Fragment>
  )
}
