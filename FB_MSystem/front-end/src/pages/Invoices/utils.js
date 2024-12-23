// utils.js

export function toVietnameseCurrencyString(number) {
    if (isNaN(number) || number === "" || number < 0) {
      return ""; // Return an empty string for invalid inputs
    }
  
    if (number === 0) {
      return "không đồng"; // Special case for zero
    }
  
    const formatter = new Intl.NumberFormat("vi-VN");
    return `${readNumber(number)} đồng`;
  }
  
  function readNumber(number) {
    const units = ["", "một", "hai", "ba", "bốn", "năm", "sáu", "bảy", "tám", "chín"];
    const tenToNineteen = [
      "mười", "mười một", "mười hai", "mười ba", "mười bốn", "mười lăm", "mười sáu", "mười bảy", "mười tám", "mười chín"
    ];
    const tens = [
      "", "mười", "hai mươi", "ba mươi", "bốn mươi", "năm mươi", "sáu mươi", "bảy mươi", "tám mươi", "chín mươi"
    ];
    const groups = ["", "nghìn", "triệu", "tỷ", "nghìn tỷ"];
  
    let words = [];
    let chunkCount = 0;
    const chunks = [];
  
    let numStr = number.toString();
  
    for (let i = numStr.length; i > 0; i -= 3) {
      chunks.push(numStr.substring(Math.max(0, i - 3), i));
    }
  
    for (let i = 0; i < chunks.length; i++) {
      const chunk = chunks[i].padStart(3, "0"); 
      const hundred = parseInt(chunk[0]);
      const ten = parseInt(chunk[1]);
      const unit = parseInt(chunk[2]);
  
      let chunkWords = [];
      if (hundred > 0) {
        chunkWords.push(units[hundred], "trăm");
      }
  
      if (ten === 0) {
        if (unit > 0 && chunkWords.length > 0) {
          chunkWords.push("lẻ", units[unit]);
        } else if (unit > 0) {
          chunkWords.push(units[unit]);
        }
      } else if (ten === 1) {
        chunkWords.push(tenToNineteen[unit]);
      } else if (ten > 1) {
        chunkWords.push(tens[ten]);
        if (unit === 1) {
          chunkWords.push("mốt");
        } else if (unit === 4) {
          chunkWords.push("tư");
        } else if (unit === 5) {
          chunkWords.push("lăm");
        } else if (unit > 0) {
          chunkWords.push(units[unit]);
        }
      }
  
      if (chunkWords.length > 0) {
        if (chunkCount > 0) {
          chunkWords.push(groups[chunkCount]);
        }
        words.unshift(...chunkWords);
      }
  
      chunkCount++;
    }
  
    return words.join(" ").trim();
  }
  