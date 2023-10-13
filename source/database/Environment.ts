
let _userData = ""
export const setupEnvironment = async () => {
    _userData = await window.ipcRenderer.invoke("m-userData");
}

export const userData = () => {
    return _userData;
}