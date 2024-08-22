export async function serveHtml(pathname: string): Promise<Response> {
    let htmlContent: string;

    switch (pathname) {
        case `/home.html`:
            htmlContent = await getHtmlContent(pathname);
            break;
        case '/wss-hook.html':
            htmlContent = await getHtmlContent(pathname);
            break;
        default:
            htmlContent = '<h1>404 Not Found</h1>';
            break;
    }

    return new Response(htmlContent, { 
        headers: { 'Content-Type': 'text/html' }
    });
}

async function getHtmlContent(fileName: string): Promise<string> {
    
    const contentMap: { [key: string]: string } = {
        '/home.html': `<!doctype html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <script src="https://cdn.tailwindcss.com"></script>
  <script>
    function processOrder(){
        const myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");

        const hash = document.getElementById("hash").value
        const requestOptions = {
          method: "POST",
          headers: myHeaders,
          body: JSON.stringify({ 
            hash, 
            data: document.getElementById("data").value, 
            delay: document.getElementById("delay").value 
          })
        };

        fetch("/api", requestOptions)
        .then((result) => {
            window.location.href = "/wss-hook.html?hash="+hash
        })
        .catch((error) => console.error(error));
    }
  </script>
</head>
<body>
  <main class="flex items-center justify-center min-h-screen bg-sky-300">
    <form class="w-full max-w-md bg-gray-100 p-8 rounded-xl">
        <div class="flex flex-row border bg-white items-center rounded-3xl px-4 py-1 mb-4">
          <label htmlFor="hash" class="block text-gray-700 py-1 pr-2">hash:</label>
          <input
            type="text"
            id="hash"
            value=""
            required
            class="w-full p-2 text-gray-700 focus:outline-none"
          />
        </div>
        <div class="flex flex-row border bg-white items-center rounded-3xl px-4 py-1 mb-4">
          <label htmlFor="data" class="block text-gray-700 py-1 pr-2">data:</label>
          <input
            type="text"
            id="data"
            value=""
            required
            class="w-full p-2 text-gray-700 focus:outline-none"
          />
        </div>
        <div class="flex flex-row border bg-white items-center rounded-3xl px-4 py-1 mb-4">
          <label htmlFor="delay" class="block text-gray-700 py-1 pr-2">delay:</label>
          <input
            type="number"
            id="delay"
            value="3"
            required
            class="w-full p-2 text-gray-700 focus:outline-none"
          />
        </div>
        <div class='flex justify-center items-center mb-4'>
          <button type="button" onClick="processOrder()" class="justify-center py-2 px-4 rounded-xl text-white bg-blue-500 hover:bg-blue-600 w-48">Process Order</button>
        </div>
      </form>
  </main>
  <script>
    function makeid(length) {
        let result = '';
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        const charactersLength = characters.length;
        let counter = 0;
        while (counter < length) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
        counter += 1;
        }
        return result;
    }

     document.getElementById("hash").value = makeid(5)
  </script>
</body>
</html>`,
        '/wss-hook.html': `<!doctype html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <script src="https://cdn.tailwindcss.com"></script>
  <script>
  const urlParams = new URLSearchParams(window.location.search);
    const hash = urlParams.get('hash');
  const host = window.location.host;
  const protocol = window.location.protocol === "https:" ? "wss://" : "ws://";

    const socket = new WebSocket(
        protocol+host+"/ws?hash="+hash
    );
    socket.addEventListener("open", () => { });

    socket.addEventListener("message", (event) => {
        try {
        document.getElementById(
            "wait-process"
        ).innerHTML = event.data;
        } catch (e) {}
    });
  </script>
</head>
<body>
  <main class="flex flex-col items-center justify-center min-h-screen bg-sky-300">
    <div id="wait-process" class="text-2xl mb-4">
      Wait process..
    </div>
    <button type="button" onClick="history.back()" class="justify-center py-2 px-4 rounded-xl text-white bg-blue-500 hover:bg-blue-600 w-48">Back</button>
  </main>
</body>
</html>`,
    };

    return contentMap[fileName] || '<h1>File Not Found</h1>';
}
