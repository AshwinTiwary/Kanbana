import Home from "./screens/Home";
import NavBar from "./components/NavBar";
import KanbanBoard from "./components/DragDrop";

function App() {
  return (
    <div style={{backgroundColor: "#EBF1F6", height:"100vh"}} className="d-flex flex-column align-items-center py-3">
      <NavBar />
      <Home />
    </div>
  );
}

export default App;
