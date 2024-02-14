interface MyObject {
    [key: string]: string | number; // 각 속성에 대한 명시적인 타입 정보를 제공
}

interface MappingData {
    [x: string]: string | number | undefined;
    id?: number | undefined;
    category_id?: number;
    title?: string;
    img?: number;
    form?: string;
    isbn?: string;
    summary?: string;
    detail?: string;
    author?: string;
    contents?: string;
    pages?: number;
    price?: number;
    likes?: number;
    is_liked?: number;
    pub_date?: string;
}

function convertToCamelCase(inputStr: string) {
    // '_'를 기준으로 문자열을 나누고 각 단어의 첫 글자를 대문자로 변환
    let words = inputStr.split("_").map((word, index) => {
        if (index === 0) {
            return word.toLowerCase();
        } else {
            return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
        }
    });

    // 각 단어를 붙여서 카멜 케이스로 만듦
    const camelCaseStr = words.join("");

    return camelCaseStr;
}

export function formatData(result: MappingData) {
    const resultData: MyObject = {};
    let resultArr = Object.keys(result);

    resultArr.forEach((val) => {
        resultData[convertToCamelCase(val)] = result[val] as string | number;
    });

    return resultData;
}
