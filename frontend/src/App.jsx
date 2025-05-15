import { useState } from "react";
import axios from "axios";

function App() {
  const [file, setFile] = useState(null);
  const [text, setText] = useState("");
  const [prompt, setPrompt] = useState("");
  const [results, setResults] = useState({});

  const handleUpload = async () => {
    const formData = new FormData();
    formData.append("document", file);

    const res = await axios.post("http://localhost:5000/upload", formData);
    setText(res.data.text);
  };

  const handleGeneratePrompt = async () => {
    const res = await axios.post("http://localhost:5000/generate-prompt", {
      text,
    });
    setPrompt(res.data.prompt);
    setResults(res.data.results);
  };

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">AI Prompt Generator</h1>

      <input
        type="file"
        onChange={(e) => setFile(e.target.files[0])}
        className="mb-4"
      />

      <button
        onClick={handleUpload}
        className="bg-blue-500 text-white px-4 py-2 rounded mb-4"
      >
        Upload & Extract
      </button>

      {text && (
        <>
          <h2 className="text-xl font-semibold mb-2">Extracted Text</h2>
          <pre className="bg-gray-100 p-2 max-h-48 overflow-y-scroll">
            {text}
          </pre>
          <button
            onClick={handleGeneratePrompt}
            className="bg-green-500 text-white px-4 py-2 mt-4 rounded"
          >
            Generate Prompt & Extract Key-Values
          </button>
        </>
      )}

      {prompt && (
        <>
          <h2 className="text-xl font-semibold mt-6 mb-2">Generated Prompt</h2>
          <pre className="bg-gray-100 p-2">{prompt}</pre>

          <h2 className="text-xl font-semibold mt-6 mb-2">Extracted Key-Values</h2>
          <ul className="list-disc pl-6">
            {Object.entries(results).map(([k, v]) => (
              <li key={k}>
                <strong>{k}:</strong> {v}
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
}

export default App;
