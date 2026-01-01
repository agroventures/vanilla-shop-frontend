import React from 'react'

function PageTitle({title, subtitle}) {
    return (
        <div>
            <h1 className="text-2xl font-bold text-dark">{title}</h1>
            <p className="text-sm text-vanilla-600 mt-1">
                {subtitle}
            </p>
        </div>
    )
}

export default PageTitle
