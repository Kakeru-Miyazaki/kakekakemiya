let counter = 0;

const explosionNum = 7;

export const incrementCounter = async () => {
    try {
        ++counter;
    } finally {
        if (counter == explosionNum) {
            alert("done");
        }
    }
};
export const getRandom = (size = 4) => (Math.random() * 2 - 1) * size;
export const indexKeyList = [...Array(7)].map((_, index) => index);
