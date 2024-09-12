
export default function CapitalizeName(name) {
    return name.replace(/\b\w/g, char => char.toUpperCase());
  }
  