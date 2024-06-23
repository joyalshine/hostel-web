import React from 'react'

function ErrorPage() {
  return (
    <div class="container-xxl container-p-y">
      <div class="misc-wrapper">
        <h2 class="mb-2 mx-2">Invalid URL :(</h2>
        <p class="mb-4 mx-2">Oops! 😖 URL does not exist or you are not authorized to see it.</p>
        <a href="/" class="btn btn-primary">Back to home</a>
        <div class="mt-3">
          <img
            src="/templateFiles/page-misc-error-light.png"
            alt="page-misc-error-light"
            width="500"
            class="img-fluid"
            data-app-dark-img="illustrations/page-misc-error-dark.png"
            data-app-light-img="illustrations/page-misc-error-light.png"
          />
        </div>
      </div>
    </div>
  )
}

export default ErrorPage
