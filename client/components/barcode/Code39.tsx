import React from "react";

// Minimal Code39 encoder to SVG. Accepts A-Z, 0-9 and - . space $ / + %
const CODE39: Record<string, string> = {
  "0":"101001101101","1":"110100101011","2":"101100101011","3":"110110010101","4":"101001101011","5":"110100110101","6":"101100110101","7":"101001011011","8":"110100101101","9":"101100101101",
  "A":"110101001011","B":"101101001011","C":"110110100101","D":"101011001011","E":"110101100101","F":"101101100101","G":"101010011011","H":"110101001101","I":"101101001101","J":"101011001101",
  "K":"110101010011","L":"101101010011","M":"110110101001","N":"101011010011","O":"110101101001","P":"101101101001","Q":"101010110011","R":"110101011001","S":"101101011001","T":"101011011001",
  "U":"110010101011","V":"100110101011","W":"110011010101","X":"100101101011","Y":"110010110101","Z":"100110110101","-":"100101011011",".":"110010101101"," ":"100110101101","$":"100100100101","/":"100100101001","+":"100101001001","%":"101001001001","*":"100101101101" // start/stop
};

function encode(text: string) {
  const up = `*${text.toUpperCase()}*`;
  const parts: string[] = [];
  for (const ch of up) {
    const p = CODE39[ch];
    if (!p) throw new Error(`Unsupported char: ${ch}`);
    parts.push(p);
  }
  return parts.join("0"); // narrow space between characters
}

export default function Code39({ value, height=40, scale=2, showText=false, className }: { value: string; height?: number; scale?: number; showText?: boolean; className?: string }) {
  const pattern = encode(value);
  const barWidth = 1 * scale;
  const width = pattern.length * barWidth;
  let x = 0;
  const bars: React.ReactNode[] = [];
  for (const bit of pattern) {
    if (bit === "1") {
      bars.push(<rect key={x} x={x} y={0} width={barWidth} height={height} fill="currentColor" />);
    }
    x += barWidth;
  }
  return (
    <div className={className}>
      <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} xmlns="http://www.w3.org/2000/svg" className="text-foreground">
        {bars}
      </svg>
      {showText && <div className="text-center text-xs mt-1 tracking-widest">{value.toUpperCase()}</div>}
    </div>
  );
}
