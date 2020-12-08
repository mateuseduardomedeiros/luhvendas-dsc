const toReal = {
    install(Vue, options) {
      Vue.prototype.$toReal = function(value) {
        if (isNaN(value)) {
          return null
        }
        return value.toLocaleString('pt-BR', {
          style: 'currency',
          currency: 'BRL',
        })
      }
    },
  }
  
  export default toReal