import React, { useEffect } from 'react'
import './SuperAdminOverview.css'
import { homeDataFetch } from '../../firebase/superAdminFunctions'

const SuperAdminOverview = () => {
    
    return (
        <div>
            <div className="overview-conatiner row">
                <div className="left col-md-4">
                    <div className="title">
                        <div className='row'>
                            <div className="col-3 child-1"><div className="bullet-point-green"></div></div>
                            <h6 className='col-9  child-2 text-white'>COMPLETED</h6>
                        </div>
                        <div className='row'>
                            <div className="col-3 child-1"><div className="bullet-point-red"></div></div>
                            <h6 className='col-9  child-2  text-white'>PENDING</h6>
                        </div>
                    </div>
                    <div className="data">
                        <div className="row">
                            <h6 className='child-1'>TOTAL</h6>
                        </div>
                        <div className="row">
                            <h6 className='child-2'>25K</h6>
                        </div>
                        <div className="row">
                            <h6 className='child-3'>13K</h6>
                        </div>
                    </div>
                </div>
                <div className="right col-md-8">
                    <div className="row">
                        <div className="child col">
                            <div className="subtitle">
                                <h6>MAINTENANCE</h6>
                            </div>
                            <div className="data">
                                <div className="row">
                                    <div className="col-1 child-1"><div className="bullet-point-green"></div></div>
                                    <h6 className='col-6  child-2'>1234</h6>
                                </div>
                                <div className="row">
                                    <div className="col-1 child-1"><div className="bullet-point-red"></div></div>
                                    <h6 className='col-6  child-2'>1234</h6>
                                </div>
                            </div>
                        </div>
                        <div className="child col">
                            <div className="subtitle">
                                <h6>FOOD</h6>
                            </div>
                            <div className="data">
                                <div className="row">
                                    <div className="col-1 child-1"><div className="bullet-point-green"></div></div>
                                    <h6 className='col-6  child-2'>1234</h6>
                                </div>
                                <div className="row">
                                    <div className="col-1 child-1"><div className="bullet-point-red"></div></div>
                                    <h6 className='col-6  child-2'>1234</h6>
                                </div>
                            </div>
                        </div>
                        <div className="child col">
                            <div className="subtitle">
                                <h6>CLEANING</h6>
                            </div>
                            <div className="data">
                                <div className="row">
                                    <div className="col-1 child-1"><div className="bullet-point-green"></div></div>
                                    <h6 className='col-6  child-2'>1234</h6>
                                </div>
                                <div className="row">
                                    <div className="col-1 child-1"><div className="bullet-point-red"></div></div>
                                    <h6 className='col-6  child-2'>1234</h6>
                                </div>
                            </div>
                        </div>
                        <div className="child-last col">
                            <div className="subtitle">
                                <h6>DISCIPLINE</h6>
                            </div>
                            <div className="data">
                                <div className="row">
                                    <div className="col-1 child-1"><div className="bullet-point-green"></div></div>
                                    <h6 className='col-6  child-2'>1234</h6>
                                </div>
                                <div className="row">
                                    <div className="col-1 child-1"><div className="bullet-point-red"></div></div>
                                    <h6 className='col-6  child-2'>1234</h6>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default SuperAdminOverview
