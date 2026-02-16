import { MonState } from '../types';

type PixelTone = 'outline' | 'fur' | 'innerEar' | 'eye' | 'mouth' | 'blush' | 'accent' | 'ghost';

interface PixelCell {
    x: number;
    y: number;
    tone: PixelTone;
}

const GRID_SIZE = 26;

const SPRITE_LABELS: Record<MonState, string> = {
    [MonState.Happy]: 'Smiling pixel pet',
    [MonState.Hungry]: 'Hungry pixel pet',
    [MonState.Critical]: 'Critical pixel pet',
    [MonState.Dead]: 'Exhausted pixel pet',
};

function createMask(size: number): boolean[][] {
    return Array.from({ length: size }, () => Array<boolean>(size).fill(false));
}

function drawEllipse(mask: boolean[][], cx: number, cy: number, rx: number, ry: number) {
    for (let y = 0; y < mask.length; y += 1) {
        for (let x = 0; x < mask.length; x += 1) {
            const dx = (x - cx) / rx;
            const dy = (y - cy) / ry;
            if ((dx * dx) + (dy * dy) <= 1) {
                mask[y][x] = true;
            }
        }
    }
}

function drawCircle(mask: boolean[][], cx: number, cy: number, radius: number) {
    drawEllipse(mask, cx, cy, radius, radius);
}

function dilateMask(mask: boolean[][]): boolean[][] {
    const size = mask.length;
    const output = createMask(size);

    for (let y = 0; y < size; y += 1) {
        for (let x = 0; x < size; x += 1) {
            let hasFilledNeighbor = false;
            for (let ny = y - 1; ny <= y + 1 && !hasFilledNeighbor; ny += 1) {
                for (let nx = x - 1; nx <= x + 1 && !hasFilledNeighbor; nx += 1) {
                    if (ny >= 0 && ny < size && nx >= 0 && nx < size && mask[ny][nx]) {
                        hasFilledNeighbor = true;
                    }
                }
            }
            output[y][x] = hasFilledNeighbor;
        }
    }

    return output;
}

function buildSprite(state: MonState): PixelCell[] {
    const mask = createMask(GRID_SIZE);
    drawEllipse(mask, 13, 14, 6.5, 5.8);
    drawCircle(mask, 9, 8, 2.8);
    drawCircle(mask, 17, 8, 2.8);
    drawEllipse(mask, 13, 10, 3.3, 2.2);
    drawEllipse(mask, 11, 19, 2.8, 1.3);
    drawEllipse(mask, 15, 19, 2.8, 1.3);

    const dilated = dilateMask(mask);
    const pixels = new Map<string, PixelTone>();

    const setPixel = (x: number, y: number, tone: PixelTone) => {
        if (x < 0 || x >= GRID_SIZE || y < 0 || y >= GRID_SIZE) return;
        pixels.set(`${x}:${y}`, tone);
    };

    const rect = (x: number, y: number, w: number, h: number, tone: PixelTone) => {
        for (let yy = y; yy < y + h; yy += 1) {
            for (let xx = x; xx < x + w; xx += 1) {
                setPixel(xx, yy, tone);
            }
        }
    };

    for (let y = 0; y < GRID_SIZE; y += 1) {
        for (let x = 0; x < GRID_SIZE; x += 1) {
            if (dilated[y][x] && !mask[y][x]) {
                setPixel(x, y, 'outline');
            }
        }
    }

    for (let y = 0; y < GRID_SIZE; y += 1) {
        for (let x = 0; x < GRID_SIZE; x += 1) {
            if (mask[y][x]) {
                setPixel(x, y, 'fur');
            }
        }
    }

    rect(8, 7, 2, 2, 'innerEar');
    rect(16, 7, 2, 2, 'innerEar');

    if (state === MonState.Happy) {
        rect(10, 13, 2, 1, 'eye');
        rect(15, 13, 2, 1, 'eye');
        rect(12, 15, 1, 1, 'mouth');
        rect(13, 16, 1, 1, 'mouth');
        rect(14, 15, 1, 1, 'mouth');
        rect(8, 15, 1, 1, 'blush');
        rect(18, 15, 1, 1, 'blush');
        rect(20, 6, 1, 1, 'accent');
        rect(21, 7, 1, 1, 'accent');
        rect(20, 8, 1, 1, 'accent');
    }

    if (state === MonState.Hungry) {
        rect(10, 13, 1, 1, 'eye');
        rect(11, 14, 1, 1, 'eye');
        rect(15, 14, 1, 1, 'eye');
        rect(16, 13, 1, 1, 'eye');
        rect(12, 15, 2, 2, 'mouth');
        rect(11, 17, 4, 1, 'mouth');
        rect(19, 17, 3, 1, 'accent');
        rect(18, 18, 5, 1, 'accent');
    }

    if (state === MonState.Critical) {
        rect(9, 12, 2, 1, 'eye');
        rect(16, 12, 2, 1, 'eye');
        rect(10, 13, 1, 1, 'eye');
        rect(17, 13, 1, 1, 'eye');
        rect(12, 16, 1, 1, 'mouth');
        rect(13, 15, 1, 1, 'mouth');
        rect(14, 16, 1, 1, 'mouth');
        rect(20, 9, 1, 1, 'accent');
        rect(21, 10, 1, 2, 'accent');
        rect(20, 12, 1, 1, 'accent');
    }

    if (state === MonState.Dead) {
        rect(9, 12, 1, 1, 'ghost');
        rect(11, 12, 1, 1, 'ghost');
        rect(10, 13, 1, 1, 'ghost');
        rect(10, 11, 1, 1, 'ghost');

        rect(15, 12, 1, 1, 'ghost');
        rect(17, 12, 1, 1, 'ghost');
        rect(16, 13, 1, 1, 'ghost');
        rect(16, 11, 1, 1, 'ghost');

        rect(11, 16, 5, 1, 'mouth');
        rect(6, 10, 1, 1, 'ghost');
        rect(19, 10, 1, 1, 'ghost');
        rect(12, 4, 3, 1, 'ghost');
    }

    return Array.from(pixels.entries()).map(([key, tone]) => {
        const [x, y] = key.split(':').map(Number);
        return { x, y, tone };
    });
}

interface PixelPetProps {
    state: MonState;
}

export default function PixelPet({ state }: PixelPetProps) {
    const spriteCells = buildSprite(state);

    return (
        <div className={`pixel-pet pixel-pet--${state.toLowerCase()}`} role="img" aria-label={SPRITE_LABELS[state]}>
            {spriteCells.map((cell) => (
                <span
                    key={`${cell.x}-${cell.y}`}
                    className={`pixel-pet__pixel pixel-pet__pixel--${cell.tone}`}
                    style={{
                        gridColumn: cell.x + 1,
                        gridRow: cell.y + 1,
                    }}
                />
            ))}
        </div>
    );
}
