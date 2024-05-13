import { useEffect, useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

function App() {
  const [count, setCount] = useState(10000)
  const [text, setText] = useState([])

  const increase = () => {
    let i = count;
    const interval = setInterval(() => {
      setCount(i);

      i++;
      if (i === 1000000) {
        clearInterval(interval);
      }
    }, 100);
  };

  useEffect(() => {
    increase();
    createData()
  }, []);

  const createData = () => {
    let newArry = []; 
    for (let i = 0; i <= 3000; i++) {
      newArry.push("I Love Fuse Box ❤️" + i);
    }
    console.log(newArry);
    setText(newArry); 
  }
  

  return (
    <div>
      <h1>I</h1>
      <h2>Love</h2>
      <h1>Fuse Box ❤️{count}</h1>
      {
        text.map((tex,index)=>(
          <h3>{tex}</h3>
        ))
      }
      {/* <button onClick={() => setCount(count + 1)} >Click me</button> */}
    </div>
  )
}

export default App


