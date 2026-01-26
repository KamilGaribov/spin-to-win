import './App.css';
import VideoScene from "components/VideoScene";
import Overlay from "components/Overlay";
import Navbar from 'components/Navbar';


export default function App() {
  return (
    <>
      <Navbar />
      <VideoScene />
      <Overlay />
    </>
  );
}
