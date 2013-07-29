Ext.define('DD.view.DraggableItem', {
    extend: 'Ext.Container',
    alias: 'widget.draggablesetting',

    requires: [
        'Ext.Label'
    ],

    config: {
        label: '',
        initialIndex: 0,
        sectionId: 0,            // pass in a unique identifier
        cls: 'draggablesetting', // gives me a dom selector
        height: 60,
        margin: '0 10 0 10',
        style: 'border-radius: 5px; background-color: lightgray; opacity: 0.0; box-shadow: 0px 0px 10px rgba(50, 50, 50, 0.75);',
        width: 380,
        items: [
            {
                xtype: 'container',
                docked: 'top',
                height: 50,
                itemId: 'toolbar',
                layout: {
                    type: 'hbox'
                },
                items: [
                    {
                        xtype: 'label',
                        flex: 1,
                        height: 50,
                        margin: '5 5 0 5',
                        width: ''
                    }
                ]
            }
        ]
    },

    initialize: function() {
        this.callParent(arguments);
        this.down('label').setHtml(this.getLabel());
    }

});