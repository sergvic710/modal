smodal = {}

Element.prototype.appendBefore = function (element) {
  element.parentNode.insertBefore(this, element);
}

Element.prototype.appendAfter = function (element) {
  element.parentNode.insertBefore(this, element.nextSibling);
}

function noop() {}

function _createModalFooter( btns = [] ){
  const footer = document.createElement('div')
  if( btns.length == 0 ) {
    return footer
  }
  footer.classList.add('smodal-footer')
  btns.forEach( btn => {
    const $btn = document.createElement('button')
    $btn.textContent = btn.text
    $btn.classList.add('btn')
    $btn.classList.add(`btn-${btn.type || 'secondary'}`)
    $btn.onclick = btn.handler || noop
    footer.appendChild($btn)
  })
  return footer
}

function _createModal(options) {
  const modal = document.createElement('div')
  modal.classList.add('smodal')
  modal.insertAdjacentHTML('afterbegin', `
    <div class="smodal-overlay" ${options.closable ? `data-close` : ''}>
    <div class="smodal-wrap">
      <div class="smodal-header">
        <span class="smodal-header__title">${options.title || 'ss'}</span>
        ${options.closable ? `<span class="smodal-title__close" data-close>&times;</span>` : ''}
      </div>
      <div class="smodal-body" data-body>
        ${options.content || ''}
      </div>
    </div>
  </div>
  `)
  document.body.appendChild(modal)
  const footer = _createModalFooter(options.buttons)
  footer.appendAfter(document.querySelector('[data-body]'))
  return modal
}



smodal.create = function (options) {
  let destroyed = false;
  if( options === undefined) {
    options = {}
  }
  const $modal = _createModal(options)
  let closing = false;
  const funcs = {
    open() {
      if( destroyed ) {
        return console.log('Modal destroyed')
      }
      !closing && $modal.classList.add('open')
    },
    close() {
      closing = true;
      $modal.classList.remove('open')
      closing = false
    }
  }
  const listener = event => {
    if( event.target.dataset.close === '') {
      funcs.close()
    }
  }
  $modal.addEventListener('click', listener)
  return Object.assign(funcs, {
    destroy() {
      destroyed = true
      $modal.parentNode.removeChild($modal)
      $modal.removeEventListener('click', listener)
    },
    setContent(html) {
      $modal.querySelector('[data-body]').innerHTML = html
    }
  })
}