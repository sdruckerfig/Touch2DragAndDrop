Ext.define('DD.view.DDEditor', {
    extend: 'Ext.Container',
    alias: 'widget.arranger',
    requires: ['Ext.Anim', 'Ext.TitleBar'],
    slots : [],
    slot : {},
    spacing : 80,

    config: {
        centered: true,
        height: 540,
        style: 'background-color: white; webkit-box-shadow: 0px 3px 14px rgba(51, 50, 50, 0.65)',
        width: 400,
        
        title: "Section Editor",
        
        layout: {
            type: 'fit'
        },
        modal: true,
        hideOnMaskTap: true,
        
        hideAnimation: {
            type: 'fadeOut',
            duration: 200
        },
        
        dragItems: [
          { id: 1, label: 'Section One' },
          { id: 2, label: 'Section Two' },
          { id: 3, label: 'Section Three' },
          { id: 4, label: 'Section Four' }
        ],

        items: [
            {
                xtype: 'toolbar',
                docked: 'bottom',
                itemId: 'toolbar',
                layout: {
                    pack: 'end',
                    type: 'hbox'
                },
                items: [
                    {
                        xtype: 'button',
                        handler: function(button, event) {
                            var top = button.up('arranger');
                            top.resetSettings.call(top);
                        },
                        left: 5,
                        top: 6,
                        text: 'Reset'
                    },
                    {
                        xtype: 'button',
                        handler: function(button, event) {
                            var top = button.up('arranger');
                            console.log(top.slots);
                          
                            var cmp = {};
                            var results = [];
                            for (var i=0; i<top.slots.length; i++) {
                                cmp = Ext.getCmp(top.slots[i].id);
                                results.push({
                                    id: cmp.getSectionId(),
                                    label: cmp.getLabel()
                                })
                            }
                            console.log('order of selections: ', results);
                            top.fireEvent('save',top,results);
                        },
                        ui: 'confirm',
                        text: 'Save'
                    }
                ]
            },
            {
                xtype: 'titlebar',
                docked: 'top'
            },
            {
                xtype: 'component',
                docked: 'top',
                height: 70,
                html: '<p style="font-size: 0.8em">Tap and drag fields to customize your view. Tap the Save button to save your preferences. Tap Reset to revert to the previous layout.</p>',
                itemId: 'instructions',
                margin: '5 5 20 8'
            }
        ],
        listeners: [
            {
                fn: 'onContainerHide',
                event: 'hide'
            }
        ]
    },

    onContainerHide: function(component, eOpts) {
        component.destroy();
    },

    initialize: function() {
        this.callParent(arguments);

        this.down('titlebar').setTitle(this.getTitle());

        // define draggable sections
        var layoutItems = [];
        
        var sections = this.getDragItems();
        this.numItems = sections.length; // cache num items for spacing calculation
        var draggable = {};

        for (var i=0; i<sections.length; i++) {

            

            draggable = {
                xtype: 'draggablesetting',
                hidden: false,
                initialIndex: i,
                draggable: {
                    direction: 'vertical',
                    listeners: {
                        drag: this.onDrag,
                        dragend: this.onDrop,
                        dragstart: this.onDragStart,
                        scope: this
                    }
                },
                itemId: 'draggable' + i,
                label: sections[i].label,
                sectionId: sections[i].id
            }
            layoutItems.push(draggable);

        }

        this.add(layoutItems);


        Ext.Function.defer(this.initializeDraggables,250,this);

    },

    initializeDraggables: function() {

        this.slots = [];
       // var cmps = Ext.ComponentQuery.query("draggablesetting");


        var els = Ext.select("div.draggablesetting");
        var me = this;
        for (var i=0; i<els.elements.length; i++) {

            var el = Ext.get(els.elements[i]);

            var tf = 'translate3d(0px, ' + (( i * this.spacing) + 1) + 'px,0px)';

            this.slots[i] = el;


            Ext.Anim.run(el, new Ext.Anim({
                autoClear: true,
                easing: 'ease-in',
                duration: 500,
                from: {
                    '-webkit-transform': 'translate3d(0px,0px,0px)',
                    'opacity': 0.0
                },
                to: {
                    '-webkit-transform': tf,
                    'opacity' : 1.0
                },
                after: function(el) {
                    var cmp =  Ext.getCmp(el.getId());
                    cmp.getDraggable().setOffset(0,cmp.getInitialIndex() * me.spacing);
                }
            }));

        }
    },

    onDrag: function(dd, e, offsetX, offsetY, eOpts) {
        el = dd.getElement();

        var oldslot = this.slot;
        var slot = Ext.Number.constrain(Ext.Number.toFixed(offsetY / this.spacing,0),0,this.slots.length);


        if (slot != this.slot && slot >= 0) {
            this.slot = slot;


            var tf1 = 'translate3d(0px, ' + ( this.slot * this.spacing) + 'px,0px)';
            var tf2 = 'translate3d(0px, ' + ( oldslot * this.spacing) + 'px,0px)';

            Ext.Anim.run(this.slots[this.slot], new Ext.Anim({
                autoClear: false,
                easing: 'ease-in',
                duration: 500,
                from: {
                    '-webkit-transform': tf1
                },
                to: {
                    '-webkit-transform': tf2
                }
            }));

            var temp = this.slots[this.slot];
            this.slots[this.slot] = el;
            this.slots[oldslot] = temp;
        }
    },

    onDrop: function(el, e, offsetX, offsetY, eOpts) {

        for (var i=0; i<this.slots.length; i++) {
            var cmp =  Ext.getCmp(this.slots[i].getId());
            cmp.getDraggable().setOffset(0,i * this.spacing);
        }
    },

    onDragStart: function(el, e, offsetX, offsetY, eOpts) {
        this.slot = Ext.Number.toFixed(offsetY / this.spacing,0);

    },

    resetSettings: function(settings) {

        // roll back up
        for (var i=0; i<this.slots.length; i++) {

            Ext.Anim.run(this.slots[i], new Ext.Anim({
                autoClear: false,
                easing: 'ease-in',
                duration: 400,
                from: {
                    '-webkit-transform': this.slots[i].getStyle('-webkit-transform')
                },
                to: {

                    '-webkit-transform': 'translate3d(0px,0px,0px)' 
                }
            }));
        }

        Ext.Function.defer(function() {
            var draggables = this.query('draggablesetting');
            for (var i=0; i<draggables.length; i++) {
                draggables[i].destroy();   
            }
            
            this.initialize();

        },400,this);
    }

});