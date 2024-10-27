import html2canvas from "html2canvas";

const exportAsImage = async (element) => {
    const canvas = await html2canvas(element);
    const image = canvas.toDataURL("image/png", 1.0);
    return image;
};

export const clickScreen = async () => {
    const element = document.getElementsByClassName("onecol")[0];
    const date = new Date();
    const fileName = `shot_CAEN_${date.toLocaleDateString("ru")}_${date.toLocaleTimeString("ru")}.png`;
    const image = await exportAsImage(element);

    const fakeLink = window.document.createElement("a");
    fakeLink.style = "display:none;";
    fakeLink.download = fileName;

    fakeLink.href = image;

    document.body.appendChild(fakeLink);
    fakeLink.click();
    document.body.removeChild(fakeLink);

    fakeLink.remove();
    return;
}