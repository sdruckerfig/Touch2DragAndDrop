Ext.define('DD.view.Main', {
    extend: 'Ext.Panel',
    xtype: 'main',
    requires: [
      'DD.view.DDEditor',
      'DD.view.DraggableItem'
    ],
    config: {
     
    },
    initialize: function() {
       
       
        Ext.Viewport.add({
            xtype: 'arranger'
        });
        

        /*
        Ext.Viewport.add(
        {
            xtype: 'component',
            html: 'Beam me up, scotty!',
            style: 'background-color: silver; opacity: 0.0',
            height: 200,
            width: 200,
            listeners: {
                show: function(cmp) {
                Ext.Anim.run(cmp.element, new Ext.Anim({
                 autoClear: true,
                 easing: 'ease-in',
                 duration: 500,
                 from: {
                    'opacity': 0.0
                 },
                 to: {
                    'opacity' : 1.0
                 },
                 after: function(el) {
                    var cmp =  Ext.getCmp(el.getId());
                    cmp.setStyle('background-color: silver; opacity: 1.0');
                 }
            }));

                }
            }
        }
        */
        /*
        {
            xtype: 'component',
            html: 'Hello World',
            cls: 'customstyle',
            itemId: 'mycomponent',
            listeners: {
                element: 'element',
                'taphold': 
                function(event, node, options,eOpts) { 
                    Ext.Msg.alert("Stop touching me!",
                      "Would you stop touching me??"
                    );
                    console.log('component ref:', Ext.getCmp(eOpts.info.target.substring(1)));

                }
            }
        }
        

        );
        */
    }
});
