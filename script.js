// DOM elements
const methodSelect = document.getElementById('method');
const shiftField = document.getElementById('shiftField');
const shiftInput = document.getElementById('shift');
const inputText = document.getElementById('inputText');
const outputText = document.getElementById('outputText');
const methodDescription = document.getElementById('methodDescription');

// Method descriptions
const methodDescriptions = {
    caesar: "A substitution cipher where each letter is shifted by a fixed number of positions in the alphabet. Simple but effective for basic encryption.",
    base64: "Encodes binary data into ASCII characters using a 64-character alphabet. Commonly used for encoding data in URLs and email attachments.",
    reverse: "Simply reverses the order of characters in the text. A basic form of encoding that's easy to implement and understand.",
    binary: "Converts text to binary representation (0s and 1s). Each character is represented by its 8-bit ASCII code.",
    hex: "Converts text to hexadecimal representation. Each character is represented by its 2-digit hex code."
};

// Event listeners
document.addEventListener('DOMContentLoaded', function() {
    // Show/hide fields based on selected method
    methodSelect.addEventListener('change', updateUI);
    
    // Initialize the UI
    updateUI();
});

// Update UI based on selected method
function updateUI() {
    const method = methodSelect.value;
    
    // Hide all optional fields first
    shiftField.style.display = 'none';
    
    // Show relevant fields based on method
    switch (method) {
        case 'caesar':
            shiftField.style.display = 'block';
            break;
    }
    
    // Update method description
    methodDescription.textContent = methodDescriptions[method] || 'Select an encryption method to see its description.';
}

// Caesar Cipher Functions
function caesarCipher(text, shift, encrypt = true) {
    if (!text) return '';
    
    const direction = encrypt ? 1 : -1;
    const actualShift = (shift * direction) % 26;
    
    return text.split('').map(char => {
        const code = char.charCodeAt(0);
        
        // Handle uppercase letters
        if (code >= 65 && code <= 90) {
            return String.fromCharCode(((code - 65 + actualShift + 26) % 26) + 65);
        }
        // Handle lowercase letters
        else if (code >= 97 && code <= 122) {
            return String.fromCharCode(((code - 97 + actualShift + 26) % 26) + 97);
        }
        // Keep other characters unchanged
        else {
            return char;
        }
    }).join('');
}

// Base64 Functions
function base64Encode(text) {
    if (!text) return '';
    
    // Convert string to base64
    return btoa(unescape(encodeURIComponent(text)));
}

function base64Decode(text) {
    if (!text) return '';
    
    try {
        // Convert base64 back to string
        return decodeURIComponent(escape(atob(text)));
    } catch (error) {
        return 'Error: Invalid Base64 string';
    }
}

// Reverse Text Functions
function reverseText(text) {
    if (!text) return '';
    return text.split('').reverse().join('');
}

// Binary Encoding Functions
function textToBinary(text) {
    if (!text) return '';
    return text.split('').map(char => {
        return char.charCodeAt(0).toString(2).padStart(8, '0');
    }).join(' ');
}

function binaryToText(binary) {
    if (!binary) return '';
    try {
        const binaryArray = binary.replace(/\s+/g, '').match(/.{1,8}/g);
        if (!binaryArray) return 'Error: Invalid binary format';
        
        return binaryArray.map(bin => {
            const decimal = parseInt(bin, 2);
            if (isNaN(decimal) || decimal < 0 || decimal > 255) {
                throw new Error('Invalid binary value');
            }
            return String.fromCharCode(decimal);
        }).join('');
    } catch (error) {
        return 'Error: Invalid binary string';
    }
}

// Hexadecimal Encoding Functions
function textToHex(text) {
    if (!text) return '';
    return text.split('').map(char => {
        return char.charCodeAt(0).toString(16).padStart(2, '0');
    }).join(' ');
}

function hexToText(hex) {
    if (!hex) return '';
    try {
        const hexArray = hex.replace(/\s+/g, '').match(/.{1,2}/g);
        if (!hexArray) return 'Error: Invalid hex format';
        
        return hexArray.map(hexChar => {
            const decimal = parseInt(hexChar, 16);
            if (isNaN(decimal) || decimal < 0 || decimal > 255) {
                throw new Error('Invalid hex value');
            }
            return String.fromCharCode(decimal);
        }).join('');
    } catch (error) {
        return 'Error: Invalid hex string';
    }
}



// Main encryption function
function encrypt() {
    const text = inputText.value.trim();
    const method = methodSelect.value;
    
    if (!text) {
        alert('Please enter some text to encrypt.');
        return;
    }
    
    let result = '';
    
    switch (method) {
        case 'caesar':
            const shift = parseInt(shiftInput.value);
            if (shift < 1 || shift > 25) {
                alert('Shift value must be between 1 and 25.');
                return;
            }
            result = caesarCipher(text, shift, true);
            break;
            
        case 'base64':
            result = base64Encode(text);
            break;
            
        case 'reverse':
            result = reverseText(text);
            break;
            
        case 'binary':
            result = textToBinary(text);
            break;
            
        case 'hex':
            result = textToHex(text);
            break;
            
        default:
            alert('Please select a valid encryption method.');
            return;
    }
    
    outputText.value = result;
}

// Main decryption function
function decrypt() {
    const text = inputText.value.trim();
    const method = methodSelect.value;
    
    if (!text) {
        alert('Please enter some text to decrypt.');
        return;
    }
    
    let result = '';
    
    switch (method) {
        case 'caesar':
            const shift = parseInt(shiftInput.value);
            if (shift < 1 || shift > 25) {
                alert('Shift value must be between 1 and 25.');
                return;
            }
            result = caesarCipher(text, shift, false);
            break;
            
        case 'base64':
            result = base64Decode(text);
            break;
            
        case 'reverse':
            result = reverseText(text);
            break;
            
        case 'binary':
            result = binaryToText(text);
            break;
            
        case 'hex':
            result = hexToText(text);
            break;
            
        default:
            alert('Please select a valid decryption method.');
            return;
    }
    
    outputText.value = result;
}

// Clear all input and output fields
function clearAll() {
    inputText.value = '';
    outputText.value = '';
    inputText.focus();
}

// Copy result to clipboard
function copyToClipboard() {
    if (outputText.value) {
        outputText.select();
        document.execCommand('copy');
        alert('Result copied to clipboard!');
    } else {
        alert('No result to copy.');
    }
}

// Add keyboard shortcuts
document.addEventListener('keydown', function(event) {
    // Ctrl+Enter to encrypt
    if (event.ctrlKey && event.key === 'Enter') {
        event.preventDefault();
        encrypt();
    }
    
    // Ctrl+Shift+Enter to decrypt
    if (event.ctrlKey && event.shiftKey && event.key === 'Enter') {
        event.preventDefault();
        decrypt();
    }
    
    // Escape to clear all
    if (event.key === 'Escape') {
        event.preventDefault();
        clearAll();
    }
}); 