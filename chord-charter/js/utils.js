import { chordTones, chordSeconds, chordFourths, chordAlternateThirds, chordTypes, chordMajorSevenths, chordSevenths } from './config.js';

export function buildNotesForDisplay(chord, addSeventh, addSecond, addFourth, addSus, addMajSeventh, qualityState) {
    if (!chord || !chordTones[chord]) {
        return [{ note: chord || '?', type: 'unknown' }];
    }

    let finalNotes = [];
    const baseTones = [...chordTones[chord]];
    finalNotes.push({ note: baseTones[0], type: 'root' });

    if (addSus) {
        if (addSecond && chordSeconds[chord]) finalNotes.push({ note: chordSeconds[chord], type: '2nd' });
        if (addFourth && chordFourths[chord]) finalNotes.push({ note: chordFourths[chord], type: '4th' });
    } else {
        let thirdNote = baseTones[1];
        if (chordAlternateThirds[chord] && (qualityState === 'major' || qualityState === 'minor')) {
            thirdNote = chordAlternateThirds[chord][qualityState];
        } else if (qualityState === 'none' && chordTypes[chord]) {
            const defaultQuality = chordTypes[chord];
            if (chordAlternateThirds[chord] && (defaultQuality === 'major' || defaultQuality === 'minor')) {
                thirdNote = chordAlternateThirds[chord][defaultQuality];
            }
        }
        finalNotes.push({ note: thirdNote, type: '3rd' });

        if (addSecond && chordSeconds[chord]) {
            const rootIndex = finalNotes.findIndex(n => n.type === 'root');
            finalNotes.splice(rootIndex + 1, 0, { note: chordSeconds[chord], type: '2nd' });
        }
        if (addFourth && chordFourths[chord]) {
            const thirdIndex = finalNotes.findIndex(n => n.type === '3rd');
            finalNotes.splice(thirdIndex !== -1 ? thirdIndex + 1 : finalNotes.length, 0, { note: chordFourths[chord], type: '4th' });
        }
    }

    if (baseTones[2]) finalNotes.push({ note: baseTones[2], type: '5th' });

    if (addSeventh) {
        const seventhNote = addMajSeventh && chordMajorSevenths[chord] ? chordMajorSevenths[chord] : chordSevenths[chord];
        if (seventhNote) finalNotes.push({ note: seventhNote, type: '7th' });
    }

    const noteOrder = { 'root': 1, '2nd': 2, '3rd': 3, '4th': 4, '5th': 5, '7th': 6 };
    finalNotes.sort((a, b) => (noteOrder[a.type] || 99) - (noteOrder[b.type] || 99));
    return finalNotes;
}

export function clampBpm(val) { 
    return Math.max(30, Math.min(300, val)); 
}
