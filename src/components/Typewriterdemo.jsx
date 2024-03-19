import React from 'react'
import Typewriter from 'typewriter-effect';
const Typewriterdemo = () => {
  return (
    <><h1 className="me-2">Taguette Your</h1>
    <h1 className="text-nowrap">
      <Typewriter
        options={{
          loop: true,
        }}
        onInit={(typewriter) => {
          typewriter
            .typeString(
              '<span style="color: #27ae60; font-weight:bold">Highlighting Software</span> '
            )
            .pauseFor(1000)
            .deleteAll()
            .typeString(
              '<span style="color: #27ae60; font-weight:bold">Tagging Software</span>'
            )
            .pauseFor(1000)
            .deleteAll()
            .typeString(
              '<span style="color: #27ae60; font-weight:bold">Note Making Software</span>'
            )
            .pauseFor(1000)
            .start();
        }}
      />
    </h1>
    </>
  )
}

export default Typewriterdemo