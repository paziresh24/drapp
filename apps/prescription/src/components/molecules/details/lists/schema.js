export const schema = {
  drugs: [
    {
      title: 'نام دارو',
      meta: {
        width: '25%'
      },
      field: {
        key: 'service.name',
        type: 'text',
        favorite: true
      }
    },
    {
      title: 'تعداد',
      meta: {
        width: '1%'
      }
    },
    {
      title: 'دوره تکرار',
      field: 'repeat',
      meta: {
        width: '1%',
        provider: 'tamin'
      }
    },
    {
      title: 'زمان مصرف',
      meta: {
        width: '5%'
      }
    },
    {
      title: 'طریقه مصرف',
      meta: {
        width: '5%'
      }
    },
    {
      title: 'میزان مصرف',
      meta: {
        width: '5%'
      }
    },
    {
      title: 'تاریخ موثر',
      meta: {
        width: '4%',
        provider: 'salamat',
        notShowReadOnly: true
      }
    }
  ],
  lab: [
    {
      title: 'نام آزمایش',
      meta: {
        width: '55%'
      },
      field: {
        key: 'service.name',
        type: 'text',
        favorite: true
      }
    },
    {
      title: 'تعداد',
      meta: {
        width: '5%'
      }
    },
    {
      title: 'تاریخ موثر',
      meta: {
        width: '10%',
        notShowReadOnly: true
      }
    }
  ],
  imaging: [
    {
      title: 'نام خدمت تصویربرداری',
      meta: {
        width: '55%'
      },
      field: {
        key: 'service.name',
        type: 'text',
        favorite: true
      }
    },
    {
      title: 'تعداد',
      meta: {
        width: '5%'
      }
    },
    {
      title: 'تاریخ موثر',
      meta: {
        width: '10%',
        notShowReadOnly: true
      }
    }
  ],
  others: [
    {
      title: 'نام پاراکلینیک',
      meta: {
        width: '55%'
      },
      field: {
        key: 'service.name',
        type: 'text',
        favorite: true
      }
    },
    {
      title: 'تعداد',
      meta: {
        width: '5%'
      }
    },
    {
      title: 'تاریخ موثر',
      meta: {
        width: '10%',
        notShowReadOnly: true
      }
    }
  ],
  equipment: [
    {
      title: 'نام تجهیزات',
      meta: {
        width: '25%'
      },
      field: {
        key: 'service.name',
        type: 'text',
        favorite: true
      }
    },
    {
      title: 'تعداد',
      meta: {
        width: '1%'
      }
    },
    {
      title: 'زمان مصرف',
      meta: {
        width: '5%'
      }
    },
    {
      title: 'میزان مصرف',
      meta: {
        width: '5%'
      }
    },
    {
      title: 'تاریخ موثر',
      meta: {
        width: '4%',
        notShowReadOnly: true
      }
    }
  ],
};
