
import tama01 from './tama_01.png';
import tama02 from './tama_02.png';
import tama03 from './tama_03.png';
import tama04 from './tama_04.png';
import tama05 from './tama_05.png';
import tama06 from './tama_06.png';
import tama07 from './tama_07.png';
import tama08 from './tama_08.png';
import tama09 from './tama_09.png';
import tama10 from './tama_10.png';
import tama11 from './tama_11.png';
import tama12 from './tama_12.png';

export const TAMA_IMAGES = {
    "normal": tama01,
    "smile": tama02,
    "surprised": tama03,
    "question": tama04,
    "angry": tama05,
    "crying": tama06,
    "scared": tama07,
    "idea": tama08,
    "sleepy": tama09,
    "love": tama10,
    "burning": tama11,
    "tired": tama12,
};

export type TamaExpression = keyof typeof TAMA_IMAGES;
