export interface Segment {
    type: 'declarition' | 'javascript';
    name?: string;
    source: string;
    position: {
        line: number,
        column: number 
    }
}

const LINE_TERMINATE_REGEX = "(\r\n|\n|\r|\u2028|\u2029)";

const DECLARATION_REGEX = "<([^>\s\/]+)[^>]*>";

const PATTERN = new RegExp(LINE_TERMINATE_REGEX + '|' + DECLARATION_REGEX, 'g');

// Translate the source code to some small segments. 
export function preprocess(source: string): Segment[] {

    const segments: Segment[] = [];
    // The PATTERN is reuseable, so we must reset the lastIndex property before to use it.
    PATTERN.lastIndex = 0;

    let line = 1;
    let lastNewlineIndex = 0;

    let segmentStartIndex = 0;
    let segmentStartLine = 1;
    let segmentStartColumn = 1;

    let match;

    while ((match = PATTERN.exec(source)) !== null) {
        if (match[1] !== undefined) {
            line++;
            lastNewlineIndex = PATTERN.lastIndex - 1;
        } else {
            if (segmentStartIndex < match.index) {
                segments.push({
                    type: 'javascript',
                    source: source.slice(segmentStartIndex, match.index),
                    position: {
                        line: segmentStartLine,
                        column: segmentStartColumn
                    }
                })
            }
            segmentStartIndex = match.index;
            segmentStartLine = line;
            segmentStartColumn = segmentStartLine - lastNewlineIndex;

            const name = match[2];
            const regex = new RegExp('<(' + name + ')[^>/]*>|</(' + name + ')[^>]*>|' + LINE_TERMINATE_REGEX, 'g');
            let counter = 1;

            regex.lastIndex = PATTERN.lastIndex;

            while ((match = regex.exec(source)) !== null) {
                if (match[1] !== undefined) {
                    line++;
                    lastNewlineIndex = regex.lastIndex - 1;
                } else if (match[3] !== undefined) {
                    counter--;
                    if (counter === 0) {
                        break;
                    }
                } else {
                    counter++;
                }
            }

            if (counter === 0) {
                segments.push({
                    type: 'declarition',
                    source: source.slice(segmentStartIndex, regex.lastIndex),
                    position: {
                        line: segmentStartLine,
                        column: segmentStartColumn
                    }
                });
                PATTERN.lastIndex = regex.lastIndex;

                segmentStartIndex = regex.lastIndex;
                segmentStartLine = line;
                segmentStartColumn = segmentStartIndex - lastNewlineIndex;

            } else {
                throw new Error("not matched. ");
            }
        }
    }
    if (segmentStartIndex < source.length) {
        segments.push({
            type: 'javascript',
            source: source.slice(segmentStartIndex),
            name: name,
            position: {
                line: segmentStartLine,
                column: segmentStartColumn
            }
        });
    }
    return segments;  
}
