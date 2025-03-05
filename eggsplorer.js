const proxyList = document.getElementById('proxyList');
const workingProxiesElement = document.getElementById('workingProxies');
let workingProxies = 0;

const checkProxy = (proxy) => {
  return fetch(proxy, { mode: 'no-cors' })
    .then(() => true)
    .catch(() => false);
};

const appendListItem = (proxy, isControl = false) => {
  const listItem = document.createElement('li');
  const statusSpan = document.createElement('span');
  statusSpan.classList.add('status');

  if (isControl) {
    const controlSpan = document.createElement('span');
    controlSpan.textContent = proxy;
    controlSpan.classList.add('control-tooltip');
    listItem.appendChild(controlSpan);

    checkProxy(proxy).then((isAccessible) => {
      statusSpan.textContent = isAccessible ? '✔' : '✖';
      statusSpan.classList.add(isAccessible ? 'yea' : 'nah');
    });
  } else {
    const proxySpan = document.createElement('a');
    proxySpan.textContent = proxy;
    proxySpan.href = proxy;
    proxySpan.target = "_blank";
    listItem.appendChild(proxySpan);

    checkProxy(proxy).then((isAccessible) => {
      statusSpan.textContent = isAccessible ? '✔' : '✖';
      statusSpan.classList.add(isAccessible ? 'yea' : 'nah');

      if (isAccessible) workingProxies++;
      workingProxiesElement.textContent = `Working Proxies: ${workingProxies} / ${proxies.length} (${workingProxies/proxies.length}%)`;
    });
  }
  listItem.appendChild(statusSpan);
  proxyList.appendChild(listItem);
};

const loadProxies = (filePath) => {
  fetch(filePath)
    .then(response => response.text())
    .then(text => {
      const proxies = text.split('\n').filter(line => line.trim() !== '');
      const controlVariable = `https://${generateRandomString()}.com`;
      appendListItem(controlVariable, true);

      proxies.forEach(domain => {
        const fullProxy = `https://${domain.trim()}`;
        appendListItem(fullProxy);
      });
    })
    .catch(error => console.error('Error due to inaccessible file:', error));
};

const generateRandomString = () => {
  const characters = 'abcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < 16; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
};

loadProxies('proxies.txt');
