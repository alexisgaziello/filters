import React, { Component } from 'react'
import {
  Container,
  Segment,
  Form,
  Radio,
  Button,
  Icon,
} from 'semantic-ui-react';

import RadioOptions from './filters/RadioOptions.jsx'
import QuestionSlider from './filters/QuestionSlider.jsx'

const tonalidad = [
  {
    name: "tonality",
    label: "Summer Vibes",
    value: "summer_vibes",
  },
  {
    name: "tonality",
    label: "Winter Vibes",
    value: "winter_vibes",
  },
  {
    name: "tonality",
    label: "California Happiness",
    value: "california_happiness",
  },
]


const tamaño = [
  {
    name: "tamaño",
    label: "1",
    value: "1",
  },
  {
    name: "tamaño",
    label: "2",
    value: "2",
  },
  {
    name: "tamaño",
    label: "3",
    value: "3",
  },
  {
    name: "tamaño",
    label: "4",
    value: "4",
  },
  {
    name: "tamaño",
    label: "5",
    value: "5",
  },
]


const Filters = () => {

  return (
    <div>
      <Container>
        <h1>Filters</h1>

        <RadioOptions
          title="Tonalidad"
          fields={tonalidad}
          tryLink="https://resizer.glanacion.com/resizer/meIoluj_woSjQUOMMYSoYCILPF4=/879x586/smart/filters:quality(80)/cloudfront-us-east-1.images.arcpublishing.com/lanacionar/DA5Y4GXFABHFPD7VZDPCARIA4U.jpg"
        />

        <RadioOptions
          title="Tamaño"
          fields={tamaño}
          tryLink="https://www.ecestaticos.com/imagestatic/clipping/c47/eac/c47eac612aa7ccb688bcb243bda93e25.jpg"
        />

        <QuestionSlider
          title="Te quitamos las ojeras?"
          tryLink="https://www.ecestaticos.com/imagestatic/clipping/c47/eac/c47eac612aa7ccb688bcb243bda93e25.jpg"
          initialSliderValue={30}
        />
      </Container>

    </div>
  );
}

export default Filters;