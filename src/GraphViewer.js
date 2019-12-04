import React, { Component } from 'react'
import CytoscapeComponent from 'react-cytoscapejs'


const cy_style =
  { 
    top: '10%',
    left: '0px',
    height: 600,

  }
const cy_stylesheet = [
  {
    selector: 'node',
    style: {
      'background-color': 'data(color)',
      'label': 'data(id)',
      'shape': 'rectangle',
      'height': 20,
      'width': 'data(width)',
    }
  },
  {
    selector: 'edge',
    style: {
      'width': 'data(penwidth)',
      "curve-style": "unbundled-bezier",
      'target-arrow-shape': 'triangle',
      'line-color': 'data(color)',
      'target-arrow-color': 'data(color)',
      'font-size': 5
    }
  }
]




export default class Viewer extends React.Component {
  constructor(props){
    super(props);
  }

  state = {
    elements: {},
    file: '',
    type: 'mauve',
    clicked: 0,
  }

  componentDidMount() {
    this.align()
  }

  componentDidUpdate() {
    this.align()
  }

  openGraph = (e) => {
    if (window.FileReader) {
      let file = e.target.files[0], reader = new FileReader();
      reader.readAsText(file);
      console.log(reader)

      reader.onload = function(r) {
        this.setState({
          elements: this.restruct_json(JSON.parse(reader.result))
        })

      }.bind(this)
    }

    else {
      alert('Sorry, your browser does\'nt support for preview');
    }

    

    e.preventDefault()
  }

  align() {
  
    let canvas = document.getElementsByTagName('canvas')
    
    for (let i = 0; i < canvas.length; i++) {
      canvas[i].style['left'] = '0px'
    }
  }


  restruct_json(json) {

    let new_json = []

    for (let i = 0; i < json.elements.nodes.length; i++) {
      
      new_json.push(
        {'data': json.elements.nodes[i].data, 'position': {x: json.elements.nodes[i].data.x, y: json.elements.nodes[i].data.y}}
      )
    }

    for (let i = 0; i < json.elements.edges.length; i++) {
      
      new_json.push(
        {'data': json.elements.edges[i].data}
      )
    }
    return new_json
  }


  render(){


    let block
    if (this.state.elements[0] == undefined) {
      console.log('empty')
      block = <h6>Please choose file</h6>
    }

    else {
      console.log('loaded')
      block = <CytoscapeComponent 
                elements={this.state.elements} 
                style={cy_style}
                stylesheet={cy_stylesheet}
              />
    }

    return (
    <div>
      Viewer
      {block}
      <input
        onChange={(e) => {
          this.openGraph(e);
          document.getElementById("input-field").value = ""}}
        type="file"
        id="input-field"
      />
    </div>
    
    
    )
  }
}