export default function AuthFlow() {
  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
        <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-4 flex flex-col items-center justify-center">
          <div className="bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300 rounded-full p-3 mb-3">
            <svg
              className="h-6 w-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
              ></path>
            </svg>
          </div>
          <h3 className="font-medium">NestJS Backend</h3>
          <p className="text-sm opacity-70 mt-2">Validates credentials and signs JWT</p>
        </div>
        <div className="flex items-center justify-center">
          <div className="hidden md:flex w-full items-center justify-center">
            <div className="h-0.5 w-full bg-gray-300 dark:bg-gray-700"></div>
            <svg
              className="h-5 w-5 opacity-50"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
            </svg>
          </div>
          <div className="md:hidden flex flex-col items-center justify-center gap-2">
            <div className="h-full w-0.5 bg-gray-300 dark:bg-gray-700"></div>
            <svg
              className="h-5 w-5 opacity-50 rotate-90"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
            </svg>
          </div>
        </div>
        <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-4 flex flex-col items-center justify-center">
          <div className="bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300 rounded-full p-3 mb-3">
            <svg
              className="h-6 w-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M20.618 5.984A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016zM12 9v2m0 4h.01"
              ></path>
            </svg>
          </div>
          <h3 className="font-medium">Next.js Client</h3>
          <p className="text-sm opacity-70 mt-2">Sends credentials and receives JWT</p>
        </div>
      </div>
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Authentication Flow</h3>
        <ol className="space-y-4 list-decimal list-inside">
          <li className="pl-2">
            <span className="font-medium">User Login:</span> User submits credentials from the Next.js client
          </li>
          <li className="pl-2">
            <span className="font-medium">Credential Validation:</span> NestJS backend validates the credentials against
            the database
          </li>
          <li className="pl-2">
            <span className="font-medium">JWT Creation:</span> Backend creates a JWT payload with user information and
            claims
          </li>
          <li className="pl-2">
            <span className="font-medium">Private Key Signing:</span> JWT is signed using a private key (ES256
            algorithm)
          </li>
          <li className="pl-2">
            <span className="font-medium">Token Response:</span> Signed JWT is sent back to the client
          </li>
          <li className="pl-2">
            <span className="font-medium">Token Storage:</span> Browser stores the JWT in a cookies or Keychain for
            mobile
          </li>
          <li className="pl-2">
            <span className="font-medium">Subsequent Requests:</span> JWT is included in the cookie or Authorization
            header
          </li>
          <li className="pl-2">
            <span className="font-medium">Public Key Verification:</span> Backend and clients verifies the token
            signature using the public key
          </li>
        </ol>
      </div>
      <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg">
        <h3 className="text-lg font-medium mb-2">Key Advantages</h3>
        <ul className="space-y-2 list-disc list-inside">
          <li className="pl-2">
            <span className="font-medium">Asymmetric Cryptography:</span> Private key for signing, public key for
            verification
          </li>
          <li className="pl-2">
            <span className="font-medium">Stateless Authentication:</span> No need to store session data on the server
          </li>
          <li className="pl-2">
            <span className="font-medium">Microservices Ready:</span> Multiple services can verify tokens with the
            public key
          </li>
          <li className="pl-2">
            <span className="font-medium">Secure:</span> Private key never leaves the backend server
          </li>
        </ul>
      </div>
    </div>
  );
}
