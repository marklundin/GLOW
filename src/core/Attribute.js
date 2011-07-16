GLOW.Attribute = (function() {
    "use strict"; "use restrict";

    // private data, functions and initializations here
    var once = false;
    var sizes = [];
    function lazyInit() {
        // lazy initialization so we know we got GL bound to a context
        sizes[GL.INT] = 1;
        sizes[GL.INT_VEC2] = 2;
        sizes[GL.INT_VEC3] = 3;
        sizes[GL.INT_VEC4] = 4;
        sizes[GL.FLOAT] = 1;
        sizes[GL.FLOAT_VEC2] = 2;
        sizes[GL.FLOAT_VEC3] = 3;
        sizes[GL.FLOAT_VEC4] = 4;
        sizes[GL.FLOAT_MAT2] = 4;
        sizes[GL.FLOAT_MAT3] = 9;
        sizes[GL.FLOAT_MAT4] = 16;
    }

    // constructor
    function attribute( parameters, data, usage, interleaved ) {
        if( !once ) {
            once = true;
            lazyInit();
        }

        this.id = GLOW.uniqueId();
        this.data = data;
        this.location = parameters.location;
        this.locationNumber = parameters.locationNumber;
        this.stride = 0;
        this.offset = 0;
        this.usage = usage !== undefined ? usage : GL.STATIC_DRAW;
        this.interleaved = interleaved !== undefined ? interleaved : false;
        this.size = sizes[ parameters.type ];
        this.name = parameters.name;
        this.type = parameters.type;

        if( this.interleaved === false ) {
            if( this.data instanceof Float32Array ) {
                this.bufferData( this.data, this.usage );
            } else {
                console.error( "GLOW.Attribute.constructor: Data for attribute " + this.name + " not in Float32Array format. Please fix. Quitting." );
            }
        }
    }

    // methods
    attribute.prototype.setupInterleave = function( offset, stride ) {
        this.interleaved = true;
        this.offset = offset;
        this.stride = stride;
    };

    attribute.prototype.bufferData = function( data, usage ) {
        if( data !== undefined && this.data !== data ) this.data = data;
        if( usage !== undefined && this.usage !== usage ) this.usage = usage;
        if( this.buffer === undefined ) this.buffer = GL.createBuffer();
        
        GL.bindBuffer( GL.ARRAY_BUFFER, this.buffer );
        GL.bufferData( GL.ARRAY_BUFFER, this.data, this.usage );
    };

    attribute.prototype.bind = function() {
        if( this.interleaved === false ) {
            GL.bindBuffer( GL.ARRAY_BUFFER, this.buffer );
        }
        GL.vertexAttribPointer( this.location, this.size, GL.FLOAT, false, this.stride, this.offset );
    };
    
    attribute.prototype.clone = function( except ) {
        if( this.interleaved ) {
            console.error( "GLOW.Attribute.clone: Cannot clone interleaved attribute. Please check your interleave setup." );
            return;
        }
        
        var clone = new GLOW.Attribute( this, this.data, this.usage, this.interleaved )
    }
    
    attribute.prototype.dispose = function() {
        // TODO
    }

    return attribute;
})();