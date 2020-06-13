Component({
  properties: {
    tabs:{
      type:Array,
      
    }
  },

  data: {

  },

  methods: {
    handleItemTap(e){
      const index=e.currentTarget.dataset.index;
      this.triggerEvent("tabsItemChange",{index});
    }
  }
})
