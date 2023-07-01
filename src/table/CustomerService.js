export const CustomerService = {
  getData () {
    return [
      {
        id: 1000,
        name: 'James Butt',
        country: {
          name: 'Algeria',
          code: 'dz'
        },
        company: 'Benton, John B Jr',
        date: '2015-09-13',
        status: 'unqualified',
        verified: true,
        activity: 17,
        representative: {
          name: 'Ioni Bowcher',
          image: 'ionibowcher.png'
        },
        balance: 70663
      },
      {
        id: 1468,
        name: 'Malcolm Tromblay',
        country: {
          name: 'Uruguay',
          code: 'uy'
        },
        company: 'Versatile Sash & Woodwork',
        date: '2019-11-25',
        status: 'renewal',
        verified: true,
        activity: 23,
        representative: {
          name: 'Xuxue Feng',
          image: 'xuxuefeng.png'
        },
        balance: 80176
      },
      {
        id: 1495,
        name: 'Brittni Gillaspie',
        country: {
          name: 'Senegal',
          code: 'sn'
        },
        company: 'Inner Label',
        date: '2019-11-23',
        status: 'renewal',
        verified: true,
        activity: 14,
        representative: {
          name: 'Ioni Bowcher',
          image: 'ionibowcher.png'
        },
        balance: 72342
      },
      {
        id: 1496,
        name: 'Raylene Kampa',
        country: {
          name: 'Belgium',
          code: 'be'
        },
        company: 'Hermar Inc',
        date: '2020-04-22',
        status: 'unqualified',
        verified: true,
        activity: 65,
        representative: {
          name: 'Stephen Shaw',
          image: 'stephenshaw.png'
        },
        balance: 53660
      }
    ]
  },

  getCustomersSmall () {
    return Promise.resolve(this.getData().slice(0, 10))
  },

  getCustomersMedium () {
    return Promise.resolve(this.getData().slice(0, 50))
  },

  getCustomersLarge () {
    return Promise.resolve(this.getData().slice(0, 200))
  },

  getCustomersXLarge () {
    return Promise.resolve(this.getData())
  },

  getCustomers (params) {
    const queryParams = params
      ? Object.keys(params)
        .map(
          (k) => encodeURIComponent(k) + '=' + encodeURIComponent(params[k])
        )
        .join('&')
      : ''

    return fetch(
      'https://www.primefaces.org/data/customers?' + queryParams
    ).then((res) => res.json())
  }
}
