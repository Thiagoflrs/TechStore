export function luhnAlgorithm(cardNumber) {
  const digits = cardNumber.split("").map(Number);
  let sum = 0;
  let shouldDouble = false;

  for (let i = digits.length - 1; i >= 0; i--) {
    let digit = digits[i];

    if (shouldDouble) {
      digit *= 2;
      if (digit > 9) digit -= 9;
    }

    sum += digit;
    shouldDouble = !shouldDouble;
  }

  return sum % 10 === 0;
}

export function detectarBandeiraParcial(numero) {
  if (!numero) return null;

  const eloRegex = /^(40117[8-9]|431274|438935|451416|457393|457631|504175|506699|5067|5090|627780|636297|636368|650031|6504|6505|6507|6509|6516|6550)/;
  
  if (eloRegex.test(numero)) return "Elo";
  if (numero.startsWith("4")) return "Visa";
  if (/^5[1-5]/.test(numero)) return "MasterCard";
  if (/^3[47]/.test(numero)) return "AmericanExpress";
  if (/^6/.test(numero)) return "Discover";
  
  return null;
}

export function getCardIssuer(cardNumber) {
  const cardPatterns = {
    Elo: /^(40117[8-9]|431274|438935|451416|457393|457631|504175|506699|5067[0-7][0-9]|5090[0-8][0-9]|627780|636297|636368|65003[1-3]|6504[0-3][0-9]|6505[0-9][0-9]|6507[0-9][0-9]|6509[0-1][0-9]|6516[5-7][0-9]|6550[0-1][0-9])[0-9]{10,12}$/,
    Visa: /^4[0-9]{12}(?:[0-9]{3})?$/,
    MasterCard: /^5[1-5][0-9]{14}$/,
    AmericanExpress: /^3[47][0-9]{13}$/,
    Discover: /^6(?:011|5[0-9]{2})[0-9]{12}$/,
  };

  for (const [issuer, pattern] of Object.entries(cardPatterns)) {
    if (pattern.test(cardNumber)) return issuer;
  }

  return "Unknown";
}

export function validateCreditCard(cardNumber) {
  const numeroLimpo = cardNumber.replace(/\D/g, "");
  const bandeiraParcial = detectarBandeiraParcial(numeroLimpo);

  if (numeroLimpo.length < 13) {
    return {
      valid: false,
      bandeira: bandeiraParcial,
    };
  }

  const isLuhnValid = luhnAlgorithm(numeroLimpo);
  const bandeiraFinal = getCardIssuer(numeroLimpo);

  return {
    valid: isLuhnValid && bandeiraFinal !== "Unknown",
    bandeira: bandeiraFinal !== "Unknown" ? bandeiraFinal : bandeiraParcial,
  };
}

export function validateExpiryDate(validade) {
  if (!validade || validade.length !== 5) {
    return { valid: false, message: "Data incompleta" };
  }

  const [mes, anoStr] = validade.split("/").map(Number);

  if (mes < 1 || mes > 12) {
    return { valid: false, message: "Mês inválido" };
  }

  const agora = new Date();
  const anoAtual = agora.getFullYear() % 100; 
  const mesAtual = agora.getMonth() + 1;

  if (anoStr < anoAtual || (anoStr === anoAtual && mes < mesAtual)) {
    return { valid: false, message: "Cartão vencido" };
  }

  if (anoStr > anoAtual + 20) {
    return { valid: false, message: "Ano inválido" };
  }

  return { valid: true, message: "Data válida" };
}