import { getRandom, incrementCounter, indexKeyList } from "./global";

const playVideoOnClick = (index: number) => {
    const explosionVideo = document.getElementById(
        `v-${index}`
    ) as HTMLVideoElement | null;

    const container = document.getElementById(`c-${index}`);
    const wrapper = document.getElementById(`w-${index}`);

    if (!explosionVideo || !container || !wrapper) {
        console.error(`cannot get elements with index ${index}`);
        return;
    }

    wrapper.addEventListener("click", async () => {
        const videoLength = 4000;

        container.style.opacity = "1";
        explosionVideo.play();
        setTimeout(async () => {
            // hide explosion video
            await incrementCounter();
            explosionVideo.style.display = "none";
        }, videoLength);
    });
};

const setPositionOfVideos = () => {
    type Pos = {
        x: number;
        y: number;
    };

    const xMargin = 8;
    const yMargin = 16;

    const positionList: Pos[] = [
        { x: getRandom() + 25 + xMargin, y: getRandom() + 16.5 + yMargin },
        { x: getRandom() + 75 - xMargin, y: getRandom() + 16.5 + yMargin },

        { x: getRandom() + 22.5, y: getRandom() + 45 },
        { x: getRandom() + 50, y: getRandom() + 50 },
        { x: getRandom() + 77.5, y: getRandom() + 45 },

        { x: getRandom() + 25 + xMargin, y: getRandom() + 79.5 - yMargin },
        { x: getRandom() + 75 - xMargin, y: getRandom() + 79.5 - yMargin },
    ];

    indexKeyList.map((index) => {
        const element = document.getElementById(`w-${index}`);

        if (!element) return;

        element.style.left = positionList[index].x + "vw";
        element.style.top = positionList[index].y + "vh";
    });
};

const main = () => {
    setPositionOfVideos();
    indexKeyList.map((index) => playVideoOnClick(index));
};

window.addEventListener("load", (event) => {
    main();
});
