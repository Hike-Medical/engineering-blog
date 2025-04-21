#!/bin/zsh

# Script generates private and public keys for auth flows for backend; frontend will use public key to verify JWTs

# Define color codes
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NO_COLOR='\033[0m'  # No Color

# Generate ECDSA private key
private_key=$(openssl ecparam -name prime256v1 -genkey -noout)

# Convert private key to PKCS#8 format
private_key_pkcs8=$(echo "$private_key" | openssl pkcs8 -topk8 -nocrypt -outform PEM)

# Generate the corresponding public key
public_key=$(echo "$private_key" | openssl ec -pubout -outform PEM)

# Output the keys in base64 format
echo ""
echo "${YELLOW}------------"
echo "Private Key:"
echo "------------${NO_COLOR}"
echo "$private_key_pkcs8" | base64
echo "${YELLOW}------------"
echo ""
echo "------------"
echo "Public Key:"
echo "------------${NO_COLOR}"
echo "$public_key" | base64
echo "${YELLOW}------------${NO_COLOR}"
echo ""

# Define a test message and append the nonce
nonce=$(openssl rand -base64 12)
message="This is a test message with nonce: $nonce"

# Sign the message using the private key
echo "${GREEN}Signing the message with the private key...${NO_COLOR}"
echo ""
signature=$(echo "$message" | openssl dgst -sha256 -sign <(echo "$private_key_pkcs8") | base64)

# Output the signature
echo "${YELLOW}------------"
echo "Signature:"
echo "------------${NO_COLOR}"
echo "$signature"
echo "${YELLOW}------------${NO_COLOR}"
echo ""

# Verify the signature using the public key
echo "${GREEN}Verifying the signature with the public key...${NO_COLOR}"
echo "$message" | openssl dgst -sha256 -verify <(echo "$public_key") \
-signature <(echo "$signature" | base64 -d) >/dev/null 2>&1 && \
echo "${GREEN}Verification successful: signature is valid${NO_COLOR}" || \
echo "${RED}Verification failed: signature is invalid${NO_COLOR}"
echo ""

# Intentionally modify the message for a failure example
altered_message="This is an altered message with nonce: $nonce"

# Verify the signature using the public key with an altered message
echo "${GREEN}Verifying the signature with an altered message...${NO_COLOR}"
echo "$altered_message" | openssl dgst -sha256 -verify <(echo "$public_key") \
-signature <(echo "$signature" | base64 -d) >/dev/null 2>&1 && \
echo "${GREEN}Verification successful: signature is valid${NO_COLOR}" || \
echo "${RED}Verification intentionally failed: signature is invalid${NO_COLOR}"