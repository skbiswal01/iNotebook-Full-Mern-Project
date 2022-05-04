import React from 'react'

export const Alert = (Props) => {
    return (
        
            Props.alert && <div>
                <div className= {`alert alert-${Props.alert.type} alert-dismissible fade show`} role="alert">
                    
                    <strong>{Props.alert.type}</strong>: {Props.alert.msg}
                   
                </div>
            </div>
          
    )
}
