/**
 * Represents a player. Players have control over multiple playables, but only
 * one playable at a time.
 *
 * @author David North
 */
function player()
{
    //The maximum X velocity a player can trvel (heading right)
    const MAX_X_VELOCITY = 200;

    //The minimum X velocity a player can trvel (heading left)
    const MIN_X_VELOCITY = -200;

    //The minimum Y velocity a player can trvel (heading up)
    const MIN_Y_VELOCITY = -250;

    /**
     * @var array An array of playables at the players disposal
     */
    var _playables = new gamejs.sprite.Group();
    _playables.add( new playable() );

    var _walkVelocity = 0;

    /**
     * @var int The current index of the playable currently under the
     * players control
     */
    var _currentIndex = 0;

    this.handleInput = function(event)
    {
        //If a key has been pressed then check it to see if an
        //action needs taking place
        if ( event.type === gamejs.event.KEY_DOWN )
        {
            switch( event.key )
            {
                //The space key denotes a jump. The player is not allowed
                //to jump if they are already falling or jumping
                case gamejs.event.K_SPACE:
                    if (  this.getVelocity().y === 0 )
                    {
                        this.setVelocity( this.getVelocity().x, MIN_Y_VELOCITY );
                        this.getCurrentPlayable().setMovement('jump');
                    }
                    break;

                //The A key, or left arrow starts to move the player left
                case gamejs.event.K_a:
                case gamejs.event.K_LEFT:
                    _walkVelocity = MIN_X_VELOCITY;
                    break;

                //The D key, or right arrow starts to move the player right
                case gamejs.event.K_d:
                case gamejs.event.K_RIGHT:
                    _walkVelocity = MAX_X_VELOCITY;
                    break;

                //The C key clones a playable, so that the player can use
                //that instead
                case gamejs.event.K_c:
                    this.clone();
                    break;

                //The Tab key switches between the playables that the
                //player can control
                case gamejs.event.K_TAB:
                    _walkVelocity = 0;
                    this.moveToNext();
            }
        }
        else if ( event.type === gamejs.event.KEY_UP )
        {
            switch( event.key )
            {
                //The A key, or left arrow starts to move the player left
                case gamejs.event.K_a:
                case gamejs.event.K_LEFT:
                    _walkVelocity = 0;
                    break;

                //The D key, or right arrow starts to move the player right
                case gamejs.event.K_d:
                case gamejs.event.K_RIGHT:
                    _walkVelocity = 0;
                    break;
            }
        }
    }

    /**
     * Sets the velocity of the current playable
     *
     * @param float x The X velocity
     * @param float y The Y velocity
     *
     * @return player
     */
    this.setVelocity = function( x, y )
    {
        var playable = this.getCurrentPlayable();
        playable.setVelocity( x, y );

        return this;
    }

    /**
     * Returns an object taht contains the X and Y velocity of the current
     * playable
     *
     * @return object
     */
    this.getVelocity = function()
    {
        return this.getCurrentPlayable().getVelocity();
    }

    /**
     * Updates all of the playable objects
     *
     * @param int msDuration
     *
     * @return player
     */
    this.update = function( msDuration )
    {
        if ( _walkVelocity )
        {
            this.setVelocity( _walkVelocity, this.getVelocity().y );
        }

        _playables.update( msDuration );
        return this;
    }

    /**
     * Draws all of the playable objects to the surface
     *
     * @param object mainSurface
     *
     * @return player
     */
    this.draw = function( mainSurface )
    {
        _playables.draw( mainSurface );
        return this;
    }

    /**
     * Moves to the next available playable for control. If the last playable
     * is selected then the first element is sed instead
     *
     * @return player
     */
    this.moveToNext = function()
    {
        if ( (_currentIndex + 1) == this.getPlayables().sprites().length )
        {
            _currentIndex = 0;
        }
        else
        {
            _currentIndex++
        }

        return this;
    }

    /**
     * Gets all of the playables available to the player
     *
     * @return array
     */
    this.getPlayables = function()
    {
        return _playables;
    }

    /**
     * Gets the current playable object that the player is in control of
     *
     * @return playable
     */
    this.getCurrentPlayable = function()
    {
        return this.getPlayables().sprites()[_currentIndex];
    }

    /**
     * Clones the current playable and adds it to the playables at the players
     * disposal
     *
     * @return player
     */
    this.clone = function()
    {
        var template = this.getCurrentPlayable();
        var clone    = new playable();
        var newX     = ( template.getX() - (template.rect.width * 2) );

        clone.setPosition(newX, template.getY() - template.image.getSize()[1]);

        _playables.add( clone );

        return this;
    }
}
