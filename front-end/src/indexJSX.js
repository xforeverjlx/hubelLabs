import React, { useState } from 'react';
var template = require('./index.html');

class Index extends React.Component {
    render(){
       return (
          <div dangerouslySetInnerHTML={{__html: template}}></div>
       );
    }
 }
 export default Index;