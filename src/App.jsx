
import { useState } from 'react';
import { ColorExtractor } from 'react-color-extractor';
import { Toaster, toast } from 'sonner'

function App() {
  const [srcImg, setSrcImg] = useState("/react.png");
  const [imgColors, setImgColors] = useState([]);
  const [bgColor, setBgColor] = useState("");
  const [colorMode, setColorMode] = useState("");

  const handleCopyClick = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      toast.success("Copiado!")
    } catch (err) {
      toast.error("Ocurrió un error al copiar!")
    }
  };

  function onFileSelected(event) {
    const selectedFile = event.target.files[0];
    if (selectedFile) {
      const reader = new FileReader();
      reader.onload = function (event) {
        const imageDataURL = event.target.result;
        setSrcImg(imageDataURL);
      };
      reader.readAsDataURL(selectedFile);
    }
  }

  function lightOrDark(color) {
    let r, g, b, hsp;
    if (color.match(/^rgb/)) {
      color = color.match(/^rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*(\d+(?:\.\d+)?))?\)$/);
      r = color[1];
      g = color[2];
      b = color[3];
    }
    else {
      color = +("0x" + color.slice(1).replace(
        color.length < 5 && /./g, '$&$&'
      )
      );
      r = color >> 16;
      g = color >> 8 & 255;
      b = color & 255;
    }
    hsp = Math.sqrt(
      0.299 * (r * r) +
      0.587 * (g * g) +
      0.114 * (b * b)
    );
    if (hsp > 127.5) {
      return 'light';
    }
    else {
      return 'dark';
    }
  }



  return (
    <>
      <Toaster richColors />
      <div className="min-h-screen w-full grid place-items-center py-5" style={{ backgroundColor: bgColor, color: colorMode == "dark" ? "#ffffff" : "#000000" }}>
        <div className="flex flex-col">
          <div className='flex flex-col items-center gap-4'>
            <ColorExtractor src={srcImg} getColors={colors => {
              setImgColors(colors)
              setBgColor(colors[0])
              setColorMode(lightOrDark(colors[0]));
            }} />
            <a href="https://josval.vercel.app/" className='font-bold italic text-xl hover:scale-105 transition-all'>@Josval</a>
            <img id="myimage" className='max-w-sm md:max-w-lg max-h-96 rounded-3xl shadow-2xl border-4 border-black' src={srcImg} />
            <input type="file" onChange={onFileSelected} accept="image/png, image/jpeg"
            />
          </div>
          <br />
          <div className='grid place-items-center'>
            <ul className='grid grid-cols-3 md:grid-cols-6 gap-5'>
              {imgColors.map((color, i) => (
                <li key={i} className="w-24 h-24 grid place-items-center rounded-3xl hover:scale-110 transition-all cursor-pointer shadow-xl border-4 border-black" style={{ backgroundColor: color, color: lightOrDark(color) == "dark" ? "#ffffff" : "#000000" }} onClick={() => {
                  handleCopyClick(color)
                }}>{color}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </>
  )
}

export default App