/**
 * Transpose chord base tone by given shift
 * @param  chord
 * @param  shift
 * @returns {string}
 */
export default function transpose(chord: string, shift: number): string {
  const chords = [
    "C",
    "C#",
    "D",
    "D#",
    "E",
    "F",
    "F#",
    "G",
    "G#",
    "A",
    "BB",
    "H",
  ];

  const isLowerCase = chord.toLowerCase() === chord; //If chord on input is lowercase, output has to be lowercase too
  if (shift < 0) {
    shift = (chords.length + shift) % chords.length;
  }
  const parts = chord.match(/^(.[#b]?)(.*)$/);
  const base = parts?.[1] ?? ""; //For C#maj7 it is "C#"

  const rest = parts?.[2] ?? ""; //For C#maj7 it is "maj7"
  const index = chords.indexOf(base.toUpperCase());

  if (index == -1) return chord; // Retrun if chord is not listed

  let newBase = chords[(index + shift) % chords.length]; //shifted base tone

  if (isLowerCase) {
    newBase = newBase.toLowerCase();
  } else if (newBase === "BB") {
    newBase = "Bb"; //this is special case, second 'b' has to be lowercase to make sense
  }

  return newBase + rest;
}
