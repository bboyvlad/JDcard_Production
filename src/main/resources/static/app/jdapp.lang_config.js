/**
 * Created by bboyvlad on 11/20/16.
 */
/**
 * Created by bboyvlad on 9/7/16.
 */
'use strict';

angular.module('jdApp').
config(
    ['$translateProvider', function config($translateProvider){
        $translateProvider.translations('en', {
            BUTTON_LANG_EN: 'English',
            BUTTON_LANG_ES: 'Spanish',
            index:{
                card1:{
                    title1:'Welcome ',
                    title2:'to our ',
                    subtitle:'Know more',
                    txt1:'If you already have a ',
                    txt2: 'Log into your account',
                    button: 'Log in',
                    txt3:'Don\'t have an online account ?',
                    link: 'register Now',

                },
                card2:{
                    title:'Log In',
                    text:'Log in to your ',
                    button: 'Log In'

                }
            },
            login:{
                card1:{
                    headline: 'Log to your account',
                    title:'Log in to your account',
                    subtitle:'Don\'t have an online account ?',
                    link: 'Register Now',
                },
                form1:{
                    f1:'Email',
                    f1error:{
                        e1: 'You did not enter a field Name',
                        e2: 'You did not enter a valid Email'
                    },
                    f2:'Password',
                    f2error:{
                        e1: 'You did not enter a password'
                    },
                    button: 'Log In'

                },
                module:{
                    sms1: ' Verify your data'
                }
            },
            singup:{
                card1:{
                    title:'Registration',
                    subtitle:'Register a new Account',
                },
                form1:{
                    f1:'Name',
                    f1error:{
                        e1: 'Don\'t forget to fill your name',
                    },
                    f2:'Last Name',
                    f2error:{
                        e1: 'Don\'t forget to fill your Last name'
                    },
                    f3:'Email',
                    f3error:{
                        e1: 'Don\'t forget to fill your Email',
                        e2: 'You did not enter a valid Email'
                    },
                    f4:'Password',
                    f4error:{
                        e1: 'The password can\'t be empty',
                        e2: 'The password length must be greater than or equal to 8',
                        e3: 'The password must contain one or more uppercase characters',
                        e4: 'The password must contain one or more lowercase characters',
                        e5: 'The password must contain one or more numeric values',
                        e6: 'The password must contain one or more special characters',
                    },
                    f5:'Repeat password',
                    f5error:{
                        e1: 'Check your password',
                        e2: 'Your password do not match'
                    },
                    button1: 'Clear',
                    button2: 'Sign Up'

                },
                module:{
                    sms1: 'This email is already in use',
                    sms2: 'Your account has been created',
                    sms3: "Welcome {{firstname}} {{lastname}},\r\nCheck your email ({{email}}) to activate your account ..\r\nYou\'ll be redirect it to the Login page"
                }
            },
            dashboard:{
                card1:{
                    title: 'Utilities',
                    subtitle: 'take full advantage of the benefits of been part of our team'
                },
                card2:{
                    title:'Add payment method',
                    text1:'Add Credit Cards to buy ',
                    text2:'and you\'ll be able to access products y services',
                    button: 'Add pay method'

                },
                card3:{
                    title:'Buy a',
                    text1:'Buy your custom',
                    text2:', to enjoy our fuel services, catering y more',
                    button: 'Buy a'

                },
                card4:{
                    title:'Balance ',
                    text1:'Available',
                    text2:'Blocked',
                    button: 'Balance details'

                },
                card5:{
                    title:'Refill',
                    text1:'Refill your ',
                    text2:', and keep enjoying our services',
                    button: 'Refill'

                }
            },
            paymethod:{
                tabs:{
                    tab1: 'Add',
                    tab2: 'Manage'
                },
                card1:{
                    headline:'Add Payment method ',
                    title:'Payment method',
                },
                coord:{
                    title: 'Validate coordinates',
                    button1: 'Close',
                    button2: 'Validate',
                },
                datatable:{
                    placeholder: 'Search',
                    f1: 'Method',
                    f2: 'Type',
                    f3: 'Card Holder',
                    f4: 'Number',
                    f5: 'Edit',
                    f6: 'Delete'
                },
                form1:{
                    f1:'payment method',
                    f1error:{
                        e1: 'Choose a payment method',
                    },
                    f2:'Number',
                    f2error:{
                        e1: 'Fill up your credit card\'s number',
                        e2: 'Your credit card number is invalid'
                    },
                    f3:'Card name',
                    f3error:{
                        e1: 'This field can\'t be empty',
                        e2: 'Only letters and spaces are allow, Example: "MATILDE R PEREZ R"'
                    },
                    f4:'Valid thru',
                    f4error:{
                        e1: 'Your credit card valid thru is required',
                        e2: 'Please enter a valid thru format MM/YYYY'
                    },
                    button1: 'Clear',
                    button2: 'Save',
                    button3: 'Update',

                },
                module:{
                    sms1: 'Create a Coordinate Card',
                    sms2: 'To add a paying method you must have a coordinate card.',
                    sms3: 'Card created successfully.. Check your email for your activation instructions',
                    sms4: 'You already have a coordinate card, but you need to activated... in your email you have the necessary instructions to activate, or generate a new one in the user manage menu...',
                    sms5: 'Error, Check Your Internet Connection',
                    sms6: 'Pay Method created',
                    sms7: 'Your card has been added successfully,\r\n to your paying methods...',
                    sms8: 'Invalid Data',
                    sms9: 'You haven\'t activated your card yet',
                    sms10: 'Update successful',
                    sms11: 'Delete Paying Method',
                    sms12: 'Please check that you wish to delete this pay method.',
                    sms13: 'Cancel',
                    sms14: 'Delete',
                    sms15: 'Pay Method, Erased successfully',
                    sms16: 'Disagree'
                }
            },
            notifypay:{
                card1:{
                    headline:'Notify Payment',
                },
                form1:{
                    f1:'Choose a payment method',
                    f1error:{
                        e1: 'Choose a payment method',
                    },
                    f2:'Choose a bank',
                    f2error:{
                        e1: 'Choose a bank',
                    },
                    f3:'Reference Number',
                    f3error:{
                        e1: 'Your deposit / transfer reference number is required',
                    },
                    f4:'Amount',
                    f4error:{
                        e1: 'An amount is required',
                        e2: 'The amount must be grater than 0'
                    },
                    f5:'Date',
                    f5error:{
                        e1: 'Transaction Date  is required',
                    },
                    button1: 'Clear',
                    button2: 'Save'

                },
                module: {
                    sms1: 'Notification Sent',
                    sms2: 'Your Payment has been notified successfully,\r\nour customer service will let you know\r\nonce is clear ...'
                }
            },
            jdcard:{
                add:{
                    card1:{
                        headline:'Buy',
                        title:'Choose a payment method',
                    },
                    card2:{
                        title:'Custom your'
                    },
                    form1:{
                        f1:'Payment method',
                        f1error:{
                            e1: 'Choose a payment method',
                        },
                        f2:'Credit card CVC code',
                        f2error:{
                            e1: 'Please enter your credit card CVC code',
                            e2: 'Please enter your 3 digits credit card CVC code, at the back of your card',
                            e3: 'Please enter your 4 digits credit card CVC code, at the back of your card'
                        },
                        f3:'Identify your',
                        f3error:{
                            e1: 'This field can\'t be empty',
                            e2: 'Only letters and spaces are allow, Example: "MATILDE R PEREZ R"',
                        },
                        f4:'Amount',
                        f4error:{
                            e1: 'Enter an amount',
                            e2: 'The amount must be greater than 0',
                        },
                        button: 'Adquire'

                    },
                    module:{
                        sms1: 'Transaction Canceled Check Your Internet Connection',
                        sms2: 'Transaction Canceled Check your Pay Method',
                        sms3: 'created',
                        sms4: 'You can use now your,',
                    }
                },
                refill:{
                    card1:{
                        headline:'Refill',
                        title:'Choose a payment method',
                    },
                    card2:{
                        title:'Choose your'
                    },
                    form1:{
                        f1:'Payment method',
                        f1error:{
                            e1: 'Choose a payment method',
                        },
                        f2:'Credit card CVC code',
                        f2error:{
                            e1: 'Please enter your credit card CVC code',
                            e2: 'Please enter your 3 digits credit card CVC code, at the back of your card',
                            e3: 'Please enter your 4 digits credit card CVC code, at the back of your card'
                        },
                        f3:'Choose your',
                        f3error:{
                            e1: 'Choose your',
                        },
                        f4:'Amount',
                        f4error:{
                            e1: 'Enter an amount',
                            e2: 'The amount must be greater than 0',
                        },
                        button1: 'Clear',
                        button2: 'Refill'

                    },
                    module:{
                        sms1: 'Transaction Canceled Check Your Internet Connection',
                        sms2: 'Refill',
                        sms3: 'Refill successful, \r\n ${{amount}} has been added to your',
                    }
                }
            },
            giftcard:{
                add:{
                    card1:{
                        headline:'Buy gift card',
                        title:'Choose a credit card',
                    },
                    card2:{
                        title:'Choose a'
                    },
                    card3:{
                        title:'Customize your gift card'
                    },
                    radio:{
                        headline:'Choose between one of these payment methods',
                        option1:{
                            title:'Credit card',
                            subtitle: 'Choose this option to pay with a credit card.'
                        },
                        option2:{
                            title:'',
                            subtitle: 'Choose this option to pay with a'
                        },
                    },
                    form1:{
                        f1:'Payment method',
                        f1error:{
                            e1: 'Choose a payment method',
                        },
                        f2:'Credit card CVC code',
                        f2error:{
                            e1: 'Please enter your credit card CVC code',
                            e2: 'Please enter your 3 digits credit card CVC code, at the back of your card',
                            e3: 'Please enter your 4 digits credit card CVC code, at the back of your card'
                        },
                        f3:'Amount',
                        f3error:{
                            e1: 'Enter an amount',
                            e2: 'The amount must be greater than 0',
                        },
                        f4:'Choose a ',
                        f4error:{
                            e1: 'Choose a ',
                        },
                        f5:'Amount',
                        f5error:{
                            e1: 'Enter an amount',
                            e2: 'The amount must be greater than 0',
                        },
                        f6:'Recipient email',
                        f6error:{
                            e1: 'This field must be fill',
                        },
                        f7:'Recipient name',
                        f7error:{
                            e1: 'This field must be fill',
                        },
                        f8:'Gift card message',
                        f8error:{
                            e1: 'This field must be fill',
                        },
                        button1: 'Clear',
                        button2: 'Buy'

                    },
                    module:{
                        sms1: 'Transaction Canceled Check Your Internet Connection',
                        sms2: 'Transaction Canceled Not enough money on your account ',
                        sms3: 'Gift Card Sent',
                        sms4: 'Your beneficiary will recieve instructions on his email, \r\nto redeem this gift card...',
                    }
                },
                redeem:{
                    card1:{
                        headline:'Redeem gift card',
                        title:'Choose a',
                    },
                    card2:{
                        title:'Claim Code'
                    },
                    form1:{
                        f1:'Choose a ',
                        f1error:{
                            e1: 'Choose a ',
                        },
                        f2:'Gift card claim code',
                        f2error:{
                            e1: 'This field must be fill',
                        },
                        button1: 'Clear',
                        button2: 'Redeem'

                    },
                    module:{
                        sms1: 'Transaction Canceled Check Your Internet Connection',
                        sms2: 'Claimed Gift Card',
                        sms3: 'The gift has been claim successfully...',
                    }
                }
            },
            defered:{
                tabs:{
                    tab1: 'Pending service requests',
                    tab2: 'Closed service requests'
                },
                card1:{
                    headline:'Pending service requests',
                    //title:'Pending payments',
                },
                card2:{
                    title:'Closed service requests',
                },
                datatable1:{
                    placeholder: 'Search',
                    title: 'Pending payments',
                    f1: 'Client',
                    f2: 'Location',
                    f3: 'Creation date',
                    f4: 'Landing date',
                    f5: 'Serial',
                    f6: 'Reverse',
                },
                datatable2:{
                    placeholder: 'Search',
                    title: 'Closed service requests',
                    f1: 'Client',
                    f2: 'Location',
                    f3: 'Creation date',
                    f4: 'Landing date',
                    f5: 'Serial',
                },
                dialog:{
                    title: 'Service request',
                    form1:{
                        f1:'Client',
                        f2:'Location',
                        f3:'Landing date',
                        button1: 'Close',
                        button2: 'Reverse'
                    },
                    datatable1:{
                        title: 'Services',
                        f1: 'Info',
                        f2: 'Unit',
                        f3: 'Price',
                        f4: 'Amount',
                    }
                },
                module:{
                    sms1: 'Reverse service request',
                    sms2: 'Please confirm that your wish to reverse this service request.',
                    btn1: 'Cancel',
                    btn2: 'Reverse',
                    sms3: 'Service request, Reversed successfully',
                }
            },
            checkpayment:{
                card1:{
                    headline:'Received payments',
                    //title:'Pending payments',
                },
                datatable1:{
                    placeholder: 'Search',
                    title: 'Received Payments',
                    f1: 'Bank',
                    f2: 'Reference',
                    f3: 'Creation date',
                    f4: 'Status',
                    f5: 'Edit',
                },
                dialog:{
                    title: 'Deposit / Transfer',
                    form1:{
                        f1:'Bank',
                        f2:'Reference',
                        f3:'Amount',
                        f4:'Date',
                        f5:'Cleared amount',
                        f6:'Approved',
                        button1: 'Close',
                        button2: 'Update'
                    }
                },
                module:{
                    sms1: 'Update successful'
                }
            },
            checkout:{
                card1:{
                    headline:'Items',
                    //title:'Pending payments',
                    sms1: 'Choose a',
                },
                form1:{
                    f1:'Choose a',
                    f1error:{
                        e1: 'Choose a payment method'
                    },
                    f2:'Acept our terms and conditions'
                },
                button1: 'Close',
                button2: 'Pay',
            },
            cart:{
                card1:{
                    headline:'Service request',
                    //title:'Pending payments',
                    sms1: 'Choose a location',
                    sms2: 'Your destination will be',
                    sms3: 'Flight details'
                },
                form1:{
                    f1:'Locations',
                    f1error:{
                        e1: 'Choose your location'
                    },
                    f2:'Estimated arrival',
                    f2error:{
                        e1: 'Don\'t forget your estimated arrival date'
                    },
                    f3:'Time',
                    f3error:{
                        e1: 'Don\'t forget your estimated arrival time',
                        e2: 'Invalid time'
                    },
                    f4:'Estimated departure',
                    f4error:{
                        e1: 'Don\'t forget your estimated departure date'
                    },
                    f5:'Time',
                    f5error:{
                        e1: 'Don\'t forget your estimated departure time',
                        e2: 'Invalid time'
                    },
                    f6:'My aircraft',
                    f6error:{
                        e1: 'Choose your aircraft'
                    },
                    f7:'My pilots',
                    f7error:{
                        e1: 'Choose a pilot'
                    },
                    f8:'Flight name',
                    f8error:{
                        e1: 'This field must be fill'
                    },
                    f9:'Incoming Location',
                    f9error:{
                        e1: 'Choose your location'
                    },

                    button1: 'Clear',
                    button2: 'Search',
                    button3: 'Clear',
                    button4: 'Save'
                },
                datatable1:{
                    f1: 'Select',
                    f2: 'Info',
                    f3: 'Unt',
                    f4: 'Price',
                    f5: 'Quantity',
                    title: 'Services'
                },
                module:{
                    sms1: 'The departure date must be equal or grater than the arrival date, please select a new departure date',
                    sms2: 'Choose the services that you wish to adquire',
                    sms3: 'Saved in your shopping cart, now you can generate this service request from your shopping cart list',
                    sms4: 'Notification',
                    sms5: 'You need to register at least one aircraft and one captain to complete the process of adding an item to the shopcart, please complete those requirements before you can continue!'
                }
            },
            cardcheck:{
                card1:{
                    headline: 'check',
                    title: 'Choose between'
                },
                form1:{
                    R1title: 'Status',
                    R1subtitle1: 'Check this option to get a',
                    R1subtitle2: 'status',
                    R2title: 'Balance',
                    R2subtitle1: 'Check this option to get a',
                    R2subtitle2: 'balance',
                    f1: 'code',
                    f1error:{
                        e1:'Enter the',
                        e2: 'Code'//empty for spanish
                    },
                    button1: 'Clear',
                    button2: 'Check'
                },
                dialog:{
                    title1: 'Card not valid for consumption please contact',
                    title2: 'Card valid for consumption',
                    datatable1:{
                        title: 'Status',
                        f1: 'Card Code',
                        f2: 'Status',
                        f3: 'Card owner',
                        f4: 'Aircraft Plate',
                    },
                    datatable2:{
                        f1: 'Group',
                        f2: 'Currency',
                        f3: 'Balance',
                        f4: 'Credit Condition',
                        f5: 'Days',
                        f6: 'Accumulated',
                        f7: 'Qttinv',
                    },
                    button1: 'Close',
                }
            },
            captain:{
                tabs:{
                    tab1: 'Add',
                    tab2: 'Manage'
                },
                card1:{
                    headline:'Add pilot ',
                    title:'Register pilot',
                },
                card2:{
                    headline:'Pilot ',
                    title:'Update pilot',
                },
                datatable:{
                    placeholder: 'Search',
                    f1: 'Name',
                    f2: 'Email',
                    f3: 'License',
                    f4: 'Phone',
                    f5: 'Edit',
                    f6: 'Delete'
                },
                form1:{
                    f1:'Names',
                    f1error:{
                        e1: 'Don\'t forget to enter the pilot\'s name'
                    },
                    f2:'Licence',
                    f2error:{
                        e1: 'Don\'t forget to enter the pilot\'s license'
                    },
                    f3:'Date of birth',
                    f3error:{
                        e1: 'Don\'t forget to enter the pilot\'s date of birth'
                    },
                    f4:'Address',
                    f4error:{
                        e1: 'Don\'t forget to enter the pilot\'s address'
                    },
                    f5:'Country',
                    f5error:{
                        e1: 'Don\'t forget to enter the pilot\'s country'
                    },
                    f6:'City',
                    f6error:{
                        e1: 'Don\'t forget to enter the pilot\'s city'
                    },
                    f7:'Phone number',
                    f7error:{
                        e1: 'Don\'t forget to enter the pilot\'s phone number'
                    },
                    f8:'Email',
                    f8error:{
                        e1: 'Don\'t forget to enter the pilot\'s email',
                        e2: 'The email is invalid'
                    },
                    f9:'Enable pilot',
                    f9label1: 'Active',
                    f9label2: 'Inactive',
                    button1: 'Clear',
                    button2: 'Save',
                    button3: 'Update',

                },
                module:{
                    sms1: 'Pilot, created successfully',
                    sms2: 'Update successful',
                    sms3: 'Erased Pilot',
                    sms4: 'Please confirm that your wish to erased this pilot.',
                    sms5: 'Pilot, Erased successfully',
                    sms6: 'Disagree'
                }
            },
            bankmanage:{
                tabs:{
                    tab1: 'Add',
                    tab2: 'Manage'
                },
                card1:{
                    headline:'Add bank account',
                },
                dialog:{
                    card1:{
                        headline:'Bank Accounts ',
                        title:'Edit bank account',
                    },
                },
                datatable:{
                    placeholder: 'Search',
                    f1: 'Bank',
                    f2: 'Account',
                    f3: 'Creation date',
                    f4: 'Status',
                    f5: 'Edit',
                    f6: 'Delete'
                },
                form1:{
                    f1:'Bank account name',
                    f1error:{
                        e1: 'Your bank account name is required'
                    },
                    f2:'Bank number',
                    f2error:{
                        e1: 'Your bank account number is required',
                        e2: 'Only numbers are allow'
                    },
                    f3:'Creation date',
                    f3error:{
                        e1: 'Don\'t forget to fill this field'
                    },
                    f4:'Bank account note',
                    f4error:{
                        e1: ''
                    },
                    f5:'Enable',
                    f5error:{
                        e1: 'The bank account status is required'
                    },
                    button1: 'Clear',
                    button2: 'Save',
                    button3: 'Update',

                },
                module:{
                    sms1: 'Bank account created',
                    sms2: "Your bank account has been added successfully,\r\nto your paymenthods...",
                    sms3: 'Update successful',
                    sms4: 'Delete bank account',
                    sms5: 'Please confirm to delete this bank account .',
                    btn1: 'Cancel',
                    btn2: 'Delete',
                    sms6: 'Bank account, Deleted successfully',
                    sms7: 'Disagree'
                }
            },
            balance:{
            tabs:{
                tab1: 'balance',
                    tab2: 'balance details'
            },
            card1:{
                headline:'balance',
                    label1: 'Available',
                    label2: 'Blocked'
            },
            card2:{
                headline:'balance ',
                    label1: 'Available',
                    label2: 'Blocked'
            },
            datatable:{
                placeholder: 'Search',
                    title: 'Transactions',
                    f1: 'Type',
                    f2: 'Amount',
                    f3: 'Date',
            },
            form1:{
                f1:'Choose a',
                    f1error:{
                    e1: 'Choose a'
                },
                f2:'From',
                    f2error:{
                    e1: 'Choose a date',
                },
                f3:'To',
                    f3error:{
                    e1: 'Choose a date',
                },
                button1: 'Clear',
                    button2: 'Search'

            }
        },
            aircraft:{
                tabs:{
                    tab1: 'Add',
                    tab2: 'Manage'
                },
                card1:{
                    headline:'Add aircraft',
                    title: 'New aircraft',
                },
                dialog:{
                    headline:'Aircraft ',
                    card2:{
                        title: 'Update aircraft',
                    },
                },
                datatable:{
                    placeholder: 'Search',
                    title: 'Transactions',
                    f1: 'Name',
                    f2: 'Model',
                    f3: 'MTOW',
                    f4: 'Status',
                    f5: 'Edit',
                    f6: 'Delete',
                },
                form1:{
                    f1:'Aircrafts',
                    f1error:{
                        e1: 'Choose your aircraft'
                    },
                    f2:'Tail number',
                    f2error:{
                        e1: 'Don\'t forget to enter the tail number',
                        e2: 'Blank spaces and symbols are not allowed in this field',
                    },
                    f3:'Aviation type',
                    f3error:{
                        e1: 'Choose an aviation type',
                    },
                    f4:'Name',
                    f4error:{
                        e1: 'Choose an name for your aircraft',
                    },
                    f5: 'Enable aircraft',
                    f5label:{
                        l1:'Active',
                        l2:'Inactive',
                        l3: 'Enable'
                    },
                    button1: 'Clear',
                    button2: 'Save',
                    button3: 'Update'

                },
                module:{
                    sms1: 'Update successful',
                    sms2: 'Error in the Operation , the update didn\'t complete ',
                    sms3: 'Aircraft created successfully',
                    sms4: 'Erase Aircraft',
                    sms5: 'Please confirm that you wish to erase this Aircraft.',
                    btn1: 'Cancel',
                    btn2: 'Delete',
                    sms6: 'Error in the operation, the elimination didn\'t complete ',
                    sms7: 'Aircraft, Deleted successfully',
                    sms8: 'Disagree'
                }
            },
            adminPending:{
                tabs:{
                    tab1: 'Open service requests',
                    tab2: 'Closed service requests'
                },
                card1:{
                    headline:'Service requests Administration',
                },
                card2:{
                    headline:'Closed service requests',
                },
                dialog:{
                    headline:'Service request ',
                    label1: 'Client',
                    label2: 'Location',
                    label3: 'Landing date',
                    datatable1:{
                        title: 'Services',
                        f1: 'Select',
                        f2: 'Info',
                        f3: 'Unt',
                        f4: 'Price',
                        f5: 'Amount',
                    }
                },

                datatable1:{
                    placeholder: 'Search',
                    title: 'Open service requests',
                    f1: 'Client',
                    f2: 'Location',
                    f3: 'Creation date',
                    f4: 'Landing date',
                    f5: 'Serial',
                    f6: 'Cleared',
                    f7: 'Prepare',
                    f8: 'Reverse'
                },
                datatable2:{
                    placeholder: 'Search',
                    title: 'Closed service requests',
                    f1: 'Client',
                    f2: 'Location',
                    f3: 'Creation date',
                    f4: 'Landing date',
                    f5: 'Serial',
                },
                form1:{
                    f1:'Ticket',
                    f1error:{
                        e1: 'Don\'t forget to enter the ticket number'
                    },
                    f2:'Amount',
                    button1: 'Close',
                    button2: 'Generate Ticket',

                },
                module:{
                    sms1: 'Create Ticket',
                    sms2: 'Please confirm that your wish to create this ticket, THIS ACTION CAN NOT BE REVERSE.',
                    btn1: 'Cancel',
                    btn2: 'Create Ticket',
                    sms3: 'Ticket, Created successfully',
                    sms4: 'Disagree',
                    sms5: 'Clear service request',
                    sms6: 'Inform the client that his service request has been cleared to proceed',
                    btn3: 'Cancel',
                    btn4: 'Clear',
                    sms7: 'Service request cleared successfully',
                    sms8: 'Disagreed',
                    sms9: 'Error in the process'

                }
            },
            products:{
                tabs:{
                    tab1: 'Add',
                    tab2: 'Manage'
                },
                card1:{
                    headline:'New Product',
                    title: 'Price'
                },
                dialog:{
                    card1:{
                        headline:'Bank Accounts ',
                        title:'Edit bank account',
                    },
                },
                datatable:{
                    placeholder: 'Search',
                    f1: 'Bank',
                    f2: 'Account',
                    f3: 'Creation date',
                    f4: 'Status',
                    f5: 'Edit',
                    f6: 'Delete'
                },
                form1:{
                    f1:'Product name',
                    f1error:{
                        e1: 'Fill this field with your product name'
                    },
                    f2:'Product description',
                    f2error:{
                        e1: 'Fill this field with your product description'
                    },
                    f3:'Measure unit',
                    f3error:{
                        e1: 'The unit measure is required'
                    },
                    f4:'Measure unit description',
                    f4error:{
                        e1: 'The measure unit description is required'
                    },
                    f5:'Product status',
                    f5label: 'Enable',
                    f6:'Price type',
                    f6error:{
                        e1: 'Choose a price type'
                    },
                    f7:'Location',
                    f7error:{
                        e1: 'Choose a location'
                    },
                    f8:'Aviation type',
                    f8error:{
                        e1: 'Choose a aviation type'
                    },
                    f9:'Price name',
                    f9error:{
                        e1: 'The price name is required'
                    },
                    f10:'Prepaid status',
                    f10label:'Enabled',
                    f11:'Valid thru',
                    f11error:{
                        e1: 'The valid thru date is required'
                    },
                    f12:'Pound range: from',
                    f12error:{
                        e1: 'Fill the starting pound range'
                    },
                    f13:'Pound range: to',
                    f13error:{
                        e1: 'Fill the ending pound range'
                    },
                    f14:'Date range: from',
                    f14error:{
                        e1: 'Fill the starting date range'
                    },
                    f15:'Date range: to',
                    f15error:{
                        e1: 'Fill the ending date range'
                    },
                    f16:'Currency',
                    f16error:{
                        e1: 'Choose a currency'
                    },
                    f17:'Measure',
                    f17error:{
                        e1: 'The measure is required'
                    },
                    f18:'Unit',
                    f18error:{
                        e1: 'The unit is required'
                    },
                    f19:'Unit description',
                    f19error:{
                        e1: 'The unit description is required'
                    },
                    f20:'Price',
                    f20error:{
                        e1: 'The price is required'
                    },
                    f21:'Cost',
                    f21error:{
                        e1: 'The cost is required'
                    },
                    f22:'Differencial',
                    f22error:{
                        e1: 'The differencial is required'
                    },
                    f23:'Is this a fee?',
                    f23label:'Enable',
                    button1: 'Clear',
                    button2: 'Create',
                    //button3: 'Update',

                },
                module:{
                    sms1: 'Your product has been created successfully'
                }
            },
            menu: {
                usermenu: {
                    opt1: 'Sing Up',
                    opt2: 'Log In',
                    tooltip: 'User'
                },
                useradmin: {
                    opt1: 'Manage Users',
                    tooltip: 'Manage Users'
                },
                jdcard: {
                    opt1: 'Buy',
                    opt2: 'Refill',
                    tooltip: 'Manage'
                },
                giftcard: {
                    opt1: 'Buy Gift Card',
                    opt2: 'Redeem Gift Card',
                    tooltip: 'Gift Cards'
                },
                payments: {
                    opt1: 'Add Payment Method',
                    opt2: 'Notify Deposit / Transfer',
                    tooltip: 'Wallet'
                },
                bankmanage: {
                    opt1: 'Bank Account Manage',
                    opt2: 'Check Payment',
                    tooltip: 'Manage Payments'
                },
                defgen: {
                    opt1: 'Products',
                    tooltip: 'Settings'
                },
                aircraft: {
                    opt1: 'Aircrafts',
                    tooltip: 'My Aircrafts'
                },
                captain: {
                    opt1: 'Pilots',
                    tooltip: 'My Pilots'
                },
                cardvalidate: {
                    opt1: 'Validator',
                    tooltip: 'Validate Card'
                },
                balance: {
                    opt1: 'Balance Details',
                    tooltip: 'Balance Details'
                },
                servrequest: {
                    opt1: 'Pending Service Requests',
                    opt2: 'Admin Pending Requests',
                    tooltip: 'Orders'
                },
                cart:{
                    opt1: 'Shopcart',
                    tooltip: 'Shopcart'
                },
                mainmenu: {
                    opt1: 'Home',
                    opt2: 'Contact',
                    opt2link: 'http://jdoilfield.com/en/?page_id=72'
                },
                module: {
                    sms1: 'Create a Coordinate Card',
                    sms2: 'Do you need a coordinate card?',
                    btn1: 'Cancel',
                    btn2: 'Create',
                    sms3: 'Card created successfully.. Check your email for your activation instructions',
                    sms4: 'The operation has been canceled',
                    sms5: 'Insufficient amount',
                    sms6: 'Choose another payment method or refill your',
                    sms7: 'Service Request',
                    sms8: 'Your service request has been successfully created, our costumer service will conctact you as soon as your order is cleared ',
                    sms9: 'Erase shopcart item',
                    sms10: 'Please confirm that you wish to erase this item ',
                    btn3: 'Cancel',
                    btn4: 'Delete',
                    sms11: 'The item has been deleted ',
                    sms12: 'The operation has been canceled',
                    sms13: 'Erase shopcart',
                    sms14: 'Please confirm that you wish to erase this shopcart ',
                    btn15: 'Cancel',
                    btn16: 'Delete',
                    sms17: 'The shopcart has been deleted ',
                    sms18: 'The operation has been canceled',
                }
            }
        });
        $translateProvider.translations('es', {
            BUTTON_LANG_EN: 'Inglés',
            BUTTON_LANG_ES: 'Español',
            index:{
                card1:{
                    title1:'Bienvenidos ',
                    title2:' a nuestra ',
                    subtitle:'Conoce más',
                    txt1:'Si usted posee una',
                    txt2: ' acceda a su cuenta',
                    button: 'acceder',
                    txt3:'Si no tienes cuenta',
                    link: 'regístrate',

                },
                card2:{
                    title:'Inicia sesión',
                    text:'Inicia sesión en tu cuenta',
                    button: 'Inicia sesión'

                }
            },
            login:{
                card1:{
                    headline: 'Acceda a su cuenta',
                    title:'Inicia sesión en tu cuenta ',
                    subtitle:'¿Aún no tienes una cuenta?',
                    link: 'Regístrese ahora',
                },
                form1:{
                    f1:'Email',
                    f1error:{
                        e1: 'Este campo debe ser completado',
                        e2: 'No introdujo un email válido'
                    },
                    f2:'Contraseña',
                    f2error:{
                        e1: 'Este campo debe ser completado'
                    },
                    button: 'Inicia sesión'

                },
                module:{
                    sms1: ' Verifique su datos'
                }
            },
            singup:{
                card1:{
                    title:'Registro',
                    subtitle:'Registre una cuenta nueva',
                },
                form1:{
                    f1:'Nombre',
                    f1error:{
                        e1: 'No olvide colocar su nombre',
                    },
                    f2:'Apellido',
                    f2error:{
                        e1: 'No olvide colocar su apellido'
                    },
                    f3:'Email',
                    f3error:{
                        e1: 'Debe llenar este campo',
                        e2: 'No introdujo un email válido'
                    },
                    f4:'Contraseña',
                    f4error:{
                        e1: 'La contraseña no puede estar vacía',
                        e2: 'La contraseña debe ser superior a 8 caracteres',
                        e3: 'La contraseña debe contener al menos un caracter en mayúscula',
                        e4: 'La contraseña debe contener al menos un caracter en minúscula',
                        e5: 'La contraseña debe contener al menos un caracter numérico',
                        e6: 'La contraseña debe contener al menos un caracter especial, por ejemplo: ',
                    },
                    f5:'Confirmar contraseña',
                    f5error:{
                        e1: 'La contraseña no puede estar vacía',
                        e2: 'Las contaseñas no coinciden'
                    },
                    button1: 'Limpiar',
                    button2: 'Registro'

                },
                module:{
                    sms1: 'Este email ya se encuentra registrado',
                    sms2: 'Su cuenta ha sido creada',
                    sms3: "Bienvenido {{firstname}} {{lastname}},\r\nRevise su correo ({{email}}) para activar su cuenta."
                }
            },
            dashboard:{
                card1:{
                    title: 'Utilidades',
                    subtitle: 'aproveche al máximo los beneficios de formar parte de nosotros'
                },
                card2:{
                    title:'Agregar método de pago',
                    text1:'Agregue tarjetas de crédito para adquirir',
                    text2:' y podrá comprar nuestros productos y servicios',
                    button: 'Agregar método de pago'

                },
                card3:{
                    title:'Comprar',
                    text1:'Con su ',
                    text2:', podrá disfrutar del suministro de combustible y otros servicios.',
                    button: 'Comprar'

                },
                card4:{
                    title:'Balance de',
                    text1:'Disponible',
                    text2:'Bloqueado',
                    button: 'Detalles del balance'

                },
                card5:{
                    title:'Recargar',
                    text1:'Recargue su ',
                    text2:', y siga disfrutando de nuestros servicios',
                    button: 'Recargue'

                }
            },paymethod:{
                tabs:{
                    tab1: 'Agregar',
                    tab2: 'Gestionar'
                },
                card1:{
                    headline:'Agregar método de pago ',
                    title:'Método de pago',
                },
                coord:{
                    title: 'Validar Coordenadas',
                    button1: 'Cerrar',
                    button2: 'Validar',
                },
                datatable:{
                    placeholder: 'Buscar',
                    f1: 'Método',
                    f2: 'Tipo',
                    f3: 'Propietario',
                    f4: 'Número',
                    f5: 'Editar',
                    f6: 'Borrar'
                },
                form1:{
                    f1:'Método de pago',
                    f1error:{
                        e1: 'Escoja un método de pago',
                    },
                    f2:'Número de tarjeta de crédito',
                    f2error:{
                        e1: 'Introduzca su número de tarjeta de crédito',
                        e2: 'Su número de tarjeta de crédito es inválido'
                    },
                    f3:'Nombre del tarjetahabiente',
                    f3error:{
                        e1: 'Este campo no puede estar vacío',
                        e2: 'Solo letras y espacios están permitidos, ejemplo: "MATILDE R PEREZ R"'
                    },
                    f4:'válido hasta',
                    f4error:{
                        e1: 'Introduzca la fecha de vencimiento',
                        e2: 'La fecha debe estar en el siguiente formato MM/YYYY'
                    },
                    button1: 'limpiar',
                    button2: 'Guardar',
                    button3: 'Actualizar'

                },
                module:{
                    sms1: 'Crear tarjeta de coordenadas',
                    sms2: 'Para agregar un método de pago debes tener una tarjeta de coordenada.',
                    sms3: 'Su tarjeta fue creada satisfactoriamente... Revise su correo para las instrucciones de activación',
                    sms4: 'Usted ya ha creado una tarjeta de coordenadas, por favor revise su correo para activarla, o genere una nueva desde el menú de usuarios',
                    sms5: 'Error, revise su conexión a internet',
                    sms6: 'Método de pago creado',
                    sms7: 'Su tarjeta fue creada satisfactoriamente,\r\n a sus métodos de pago',
                    sms8: 'Datos inválidos',
                    sms9: 'Usted no ha activado su tarjeta aún',
                    sms10: 'Actualización satisfactoria',
                    sms11: 'Método de pago borrado',
                    sms12: 'Por favor confirme que desea borrar este método de pago',
                    sms13: 'Cancelar',
                    sms14: 'Borrar',
                    sms15: 'Método de pago borrado satisfactoriamente',
                    sms16: 'Cancelado'
                }
            },
            notifypay:{
                card1:{
                    headline:'Notificar pago',
                },
                form1:{
                    f1:'Método de pago',
                    f1error:{
                        e1: 'Escoja un método de pago',
                    },
                    f2:'Escoja un banco',
                    f2error:{
                        e1: 'Escoja un banco',
                    },
                    f3:'Número de referencia',
                    f3error:{
                        e1: 'El número de depósito o transferencia es requerido',
                    },
                    f4:'Monto',
                    f4error:{
                        e1: 'Debe ingresar un monto',
                        e2: 'El monto debe ser mayor a 0 (CERO)'
                    },
                    f5:'Fecha',
                    f5error:{
                        e1: 'La fecha de la transacción es requerida',
                    },
                    button1: 'Limpiar',
                    button2: 'Guardar'

                },
                module: {
                    sms1: 'Notificación enviada',
                    sms2: 'Su pago ha sido notificado exitosamente, \r\n nuestro equipo de atención al cliente le informará \r\n una vez sea procesado ...'
                }
            },
            jdcard:{
                add:{
                    card1:{
                        headline:'Comprar ',
                        title:'Escoja un método de pago',
                    },
                    card2:{
                        title:'Personalice su '
                    },
                    form1:{
                        f1:'Método de pago',
                        f1error:{
                            e1: 'Escoja un método de pago',
                        },
                        f2:'TDC código CVC',
                        f2error:{
                            e1: 'Por favor introduzca su CVC',
                            e2: 'Por favor introduzca los 3 dígitos al reverso de su TDC ',
                            e3: 'Por favor introduzca los 4 dígitos al reverso de su TDC '
                        },
                        f3:'Identifique su',
                        f3error:{
                            e1: 'Este campo no puede estar vacío',
                            e2: 'Solo letras y espacios están permitidos, ejemplo: "MATILDE R PEREZ R"',
                        },
                        f4:'Monto',
                        f4error:{
                            e1: 'Introduzca un monto',
                            e2: 'El monto debe ser mayor 0 (CERO)',
                        },
                        button: 'Adquirir'

                    },
                    module:{
                        sms1: 'Transacción cancelada, revise su conexión a internet ',
                        sms2: 'Transacción cancelada, revise su método de pago',
                        sms3: 'creada',
                        sms4: 'Ya puedes usar tu',
                    }
                },
                refill:{
                    card1:{
                        headline:'Comprar ',
                        title:'Escoja un método de pago',
                    },
                    card2:{
                        title:'Escoja una '
                    },
                    form1:{
                        f1:'Método de pago',
                        f1error:{
                            e1: 'Escoja un método de pago',
                        },
                        f2:'TDC código CVC',
                        f2error:{
                            e1: 'Por favor introduzca su CVC',
                            e2: 'Por favor introduzca los 3 digitos al reverso de su TDC ',
                            e3: 'Por favor introduzca los 4 digitos al reverso de su TDC '
                        },
                        f3:'Escoja una',
                        f3error:{
                            e1: 'Escoja una ',
                        },
                        f4:'Monto',
                        f4error:{
                            e1: 'Introduzca un monto',
                            e2: 'El monto debe ser mayor 0 (CERO)',
                        },
                        button1: 'Limpiar',
                        button2: 'Recargar'

                    },
                    module:{
                        sms1: 'Transacción cancelada, revise su conexión a internet ',
                        sms2: 'Recargada',
                        sms3: 'Recarga satisfactoria, \r\n ${{amount}} han sido cargados a su',
                    }
                }
            },
            giftcard:{
                add:{
                    card1:{
                        headline:'Comprar tarjeta de regalo',
                        title:'Escoja una TDC',
                    },
                    card2:{
                        title:'Escoja su '
                    },
                    card3:{
                        title:'Personalice su tarjeta de regalo'
                    },
                    radio:{
                        headline:'Escoja uno de estos métodos de pago',
                        option1:{
                            title:'Tarjeta de crédito',
                            subtitle: 'Escoja esta opción para pagar con una tarjeta de crédito.'
                        },
                        option2:{
                            title:'',
                            subtitle: 'Escoja esta opción para pagar con una '
                        },
                    },
                    form1:{
                        f1:'Método de pago',
                        f1error:{
                            e1: 'Escoja un método de pago',
                        },
                        f2:'TDC código CVC',
                        f2error:{
                            e1: 'Por favor introduzca su CVC',
                            e2: 'Por favor introduzca los 3 digitos al reverso de su TDC ',
                            e3: 'Por favor introduzca los 4 digitos al reverso de su TDC '
                        },
                        f3:'Monto',
                        f3error:{
                            e1: 'Introduzca un monto',
                            e2: 'El monto debe ser mayor 0 (CERO)',
                        },
                        f4:'Escoja una ',
                        f4error:{
                            e1: 'Escoja una ',
                        },
                        f5:'Monto',
                        f5error:{
                            e1: 'Introduzca un monto',
                            e2: 'El monto debe ser mayor 0 (CERO)',
                        },
                        f6:'Email del receptor',
                        f6error:{
                            e1: 'Este campo debe ser llenado',
                        },
                        f7:'Nombre del receptor',
                        f7error:{
                            e1: 'Este campo debe ser llenado',
                        },
                        f8:'Mensaje',
                        f8error:{
                            e1: 'Este campo debe ser llenado',
                        },
                        button1: 'Limpiar',
                        button2: 'Comprar'

                    },
                    module:{
                        sms1: 'Transacción cancelada, revise su conexión a internet ',
                        sms2: 'Transacción cancelada, no tiene suficiente dinero',
                        sms3: 'Tarjeta de regalo enviada',
                        sms4: 'Su beneficiario recibirá instrucciones en su email, \r\n para reclamar esta tarjeta de regalo',
                    }
                },
                redeem:{
                    card1:{
                        headline:'Reclamar una tarjeta de regalo ',
                        title:'Escoja una ',
                    },
                    card2:{
                        title:'Código de reclamo'
                    },
                    form1:{
                        f1:'Escoja una ',
                        f1error:{
                            e1: 'Escoja una ',
                        },
                        f2:'Código de reclamo',
                        f2error:{
                            e1: 'Este campo no puede estar vacío'
                        },
                        button1: 'Limpiar',
                        button2: 'Reclamar'

                    },
                    module:{
                        sms1: 'Transacción cancelada, revise su conexión a internet ',
                        sms2: 'Tarjeta de regalo reclamada',
                        sms3: 'La tarjeta de regalo ha sido reclamada satisfactoriamente',
                    }
                }
            },
            defered:{
                tabs:{
                    tab1: 'Peticiónes de servicio pendientes',
                    tab2: 'Peticiónes de servicio cerradas'
                },
                card1:{
                    headline:'Peticiónes de servicio pendientes',
                    //title:'Pending payments',
                },
                card2:{
                    title:'Peticiónes de servicio cerradas',
                },
                datatable1:{
                    placeholder: 'Buscar',
                    title: 'Pagos pendientes',
                    f1: 'Cliente',
                    f2: 'Localidad',
                    f3: 'Fecha de creación',
                    f4: 'Fecha de aterrizaje',
                    f5: 'Serial',
                    f6: 'Reversar',
                },
                datatable2:{
                    placeholder: 'Buscar',
                    title: 'Peticiónes de servicio cerradas',
                    f1: 'Cliente',
                    f2: 'Localidad',
                    f3: 'Fecha de creación',
                    f4: 'Fecha de aterrizaje',
                    f5: 'Serial',
                },
                dialog:{
                    title: 'Peticiónes de servicio',
                    form1:{
                        f1: 'Cliente',
                        f2: 'Localidad',
                        f3: 'Fecha de aterrizaje',
                        button1: 'Cerrar',
                        button2: 'Reversar'
                    },
                    datatable1:{
                        title: 'Servicios',
                        f1: 'Info',
                        f2: 'Und',
                        f3: 'Precio',
                        f4: 'Monto',
                    }
                },
                module:{
                    sms1: 'Reversar petición de servicio',
                    sms2: 'Por favor confirme que desea reversar esta petición de servicio.',
                    btn1: 'Cancelar',
                    btn2: 'Reversar',
                    sms3: 'Petición de servicio, reversada satisfactoriamente',
                }
            },
            checkpayment:{
                card1:{
                    headline:'Pagos recibidos',
                    //title:'Pending payments',
                },
                datatable1:{
                    placeholder: 'Buscar',
                    title: 'Pagos recibidos',
                    f1: 'Banco',
                    f2: 'Referencia',
                    f3: 'Fecha de creación',
                    f4: 'Estatus',
                    f5: 'Editar',
                },
                dialog:{
                    title: 'Depósito / Transferencia',
                    form1:{
                        f1:'Banco',
                        f2:'Referencia',
                        f3:'Monto',
                        f4:'Fecha de creación',
                        f5:'Monto validado',
                        f6:'Aprovado',
                        button1: 'Cerrar',
                        button2: 'Actualizar'
                    }
                },
                module:{
                    sms1: 'Actualización satisfactoria '
                }
            },
            checkout:{
                card1:{
                    headline:'Artículos',
                    //title:'Pending payments',
                    sms1: 'Escoja una',
                },
                form1:{
                    f1:'Escoja una',
                    f1error:{
                        e1: 'Escoja un metodo de pago'
                    },
                    f2:'Acepte los terminos y condiciones'
                },
                button1: 'Cerrar',
                button2: 'Pagar',
            },
            cart:{
                card1:{
                    headline:'Peticiónes de servicios',
                    //title:'Pending payments',
                    sms1: 'Escoja una localidad',
                    sms2: 'Tu destino será',
                    sms3: 'Detalles del viaje'
                },
                form1:{
                    f1:'Locaciones',
                    f1error:{
                        e1: 'Escoja una localidad'
                    },
                    f2:'Llegada aproximada',
                    f2error:{
                        e1: 'No olvide informar sobre su fecha de llegada'
                    },
                    f3:'Hora',
                    f3error:{
                        e1: 'No olvide informar sobre su hora de llegada',
                        e2: 'Hora invalida'
                    },
                    f4:'Partida aproximada',
                    f4error:{
                        e1: 'No olvide informar sobre su fecha de partida'
                    },
                    f5:'Hora',
                    f5error:{
                        e1: 'No olvide informar sobre su hora de partida',
                        e2: 'Hora invalida'
                    },
                    f6:'Mi aeronave',
                    f6error:{
                        e1: 'Escoja su aeronave'
                    },
                    f7:'Mi piloto',
                    f7error:{
                        e1: 'Escoja su piloto'
                    },
                    f8:'Nombre de viaje',
                    f8error:{
                        e1: 'Este campo debe ser llenado'
                    },
                    f9:'Locación de origen',
                    f9error:{
                        e1: 'Escoja una localidad'
                    },

                    button1: 'Limpiar',
                    button2: 'Buscar',
                    button3: 'Limpiar',
                    button4: 'Guardar'
                },
                datatable1:{
                    f1: 'Marcar',
                    f2: 'Info',
                    f3: 'Unidad',
                    f4: 'Precio',
                    f5: 'Cantidad',
                    title: 'Servicios'
                },
                module:{
                    sms1: 'La fecha de partida debe ser igual o superior a la fecha de llegada, por favor seleccione otra fecha de llegada',
                    sms2: 'Seleccione los servicio que desea adquirir',
                    sms3: 'Salvado en su carro de compra, ahora puede generar esta petición de servicio desde su carro de compra.',
                    sms4: 'Notificación',
                    sms5: 'Necesitas registrar al menos una aeronave y un capitán para completar el proceso de agregar un articulo al carro de compra, por favor complete esos requerimientos antes de continuar!'
                }
            },
            cardcheck:{
                card1:{
                    headline: 'Validar',
                    title: 'Escoja entre'
                },
                form1:{
                    R1title: 'Estatus',
                    R1subtitle1: 'Escoja esta opción para obtener  un ',
                    R1subtitle2: 'estatus',
                    R2title: 'Balance',
                    R2subtitle1: 'Escoja esta opción para obtener  un ',
                    R2subtitle2: 'balance',
                    f1: 'código',
                    f1error:{
                        e1:'Introduzca el código de la',
                        e2: ''//empty for spanish
                    },
                    button1: 'Limpiar',
                    button2: 'Validar'
                },
                dialog:{
                    title1: 'Tarjeta con saldo negativo por favor contactar ',
                    title2: 'Tarjeta con saldo positivo',
                    datatable1:{
                        title: 'Estatus',
                        f1: 'Código de tarjeta ',
                        f2: 'Estatus',
                        f3: 'Tarjetahabiente',
                        f4: 'Placa de aeronave',
                    },
                    datatable2:{
                        f1: 'Grupo',
                        f2: 'Moneda',
                        f3: 'Balance',
                        f4: 'Condición de crédito',
                        f5: 'Días',
                        f6: 'Acumulado',
                        f7: 'Qttinv',
                    },
                    button1: 'Cerrar',
                }
            },
            captain:{
                tabs:{
                    tab1: 'Agregar',
                    tab2: 'Gestionar'
                },
                card1:{
                    headline:'Agregar piloto ',
                    title:'Registrar piloto',
                },
                card2:{
                    headline:'Piloto ',
                    title:'Actualizar piloto',
                },
                datatable:{
                    placeholder: 'Búsqueda',
                    f1: 'Nombre',
                    f2: 'Email',
                    f3: 'Licencia',
                    f4: 'Teléfono',
                    f5: 'Editar',
                    f6: 'Borrar'
                },
                form1:{
                    f1:'Nombre',
                    f1error:{
                        e1: 'No olvide ingresar el nombre del piloto'
                    },
                    f2:'Licencia',
                    f2error:{
                        e1: 'No olvide ingresar lalicencia del piloto'
                    },
                    f3:'Fecha de nac.',
                    f3error:{
                        e1: 'No olvide ingresar la fecha de nac. del piloto'
                    },
                    f4:'Dirección',
                    f4error:{
                        e1: 'No olvide ingresar la dirección del piloto'
                    },
                    f5:'Pais',
                    f5error:{
                        e1: 'No olvide ingresar el pais del piloto'
                    },
                    f6:'Ciudad',
                    f6error:{
                        e1: 'No olvide ingresar la ciudad del piloto'
                    },
                    f7:'Tlf',
                    f7error:{
                        e1: 'No olvide ingresar el teléfono del piloto'
                    },
                    f8:'Email',
                    f8error:{
                        e1: 'No olvide ingresar el email del piloto',
                        e2: 'El correo es inválido'
                    },
                    f9:'Habilitar piloto',
                    f9label1: 'Activar',
                    f9label2: 'Desactivar',
                    button1: 'Limpiar',
                    button2: 'Guardar',
                    button3: 'Actualizar',

                },
                module:{
                    sms1: 'Piloto, creado satisfactoriamente',
                    sms2: 'Actualización satisfactoria',
                    sms3: 'Borrar piloto',
                    sms4: 'Por favor confirme que desea borrar este piloto.',
                    sms5: 'Piloto borrado satisfactoriamente',
                    sms6: 'Rechazada'
                }
            },
            bankmanage:{
                tabs:{
                    tab1: 'Agregar',
                    tab2: 'Gestionar'
                },
                card1:{
                    headline:'Agregar cuenta bancaria',
                },
                dialog:{
                    card1:{
                        headline:'Cuentas bancarias ',
                        title:'Editar cuenta bancaria',
                    },
                },
                datatable:{
                    placeholder: 'Buscar',
                    f1: 'Banco',
                    f2: 'Cuenta',
                    f3: 'Fecha de creación',
                    f4: 'Estatus',
                    f5: 'Editar',
                    f6: 'Borrar'
                },
                form1:{
                    f1:'Nombre de cuenta bancaria',
                    f1error:{
                        e1: 'Nombre de cuenta bancaria es requerido'
                    },
                    f2:'Número de cuenta bancaria',
                    f2error:{
                        e1: 'Número de cuenta bancaria es requerido',
                        e2: 'Solo se permiten números'
                    },
                    f3:'Fecha de creación',
                    f3error:{
                        e1: 'Este campo de ser llenado'
                    },
                    f4:'Nota',
                    f4error:{
                        e1: ''
                    },
                    f5:'Habilitado',
                    f5error:{
                        e1: 'Este campo es requerido'
                    },
                    button1: 'Limpiar',
                    button2: 'Guardar',
                    button3: 'Actualizar',

                },
                module:{
                    sms1: 'Cuenta bancaria creada satisfactoriamente',
                    sms2: "Cuenta bancaria creada satisfactoriamente,\r\na sus métodos de pago",
                    sms3: 'Actualización satisfactoria',
                    sms4: 'Borrar cuenta bancaria',
                    sms5: 'Por favor confirme para borrar esta cuenta bancaria',
                    btn1: 'Cancelar',
                    btn2: 'Borrar',
                    sms6: 'Cuenta bancaria eliminada satisfactoriamente',
                    sms7: 'Rechazado'
                }
            },
            balance:{
                tabs:{
                    tab1: 'balance',
                    tab2: 'detalles de balance'
                },
                card1:{
                    headline:'balance',
                    label1: 'Disponible',
                    label2: 'Bloqueado'
                },
                card2:{
                    headline:'balance ',
                    label1: 'Disponible',
                    label2: 'Bloqueado'
                },
                datatable:{
                    placeholder: 'Buscar',
                    title: 'Transacciones',
                    f1: 'Tipo',
                    f2: 'Monto',
                    f3: 'Fecha',
                },
                form1:{
                    f1:'Escoja una',
                    f1error:{
                        e1: 'Escoja una'
                    },
                    f2:'Desde',
                    f2error:{
                        e1: 'Escoja una fecha',
                    },
                    f3:'Hasta',
                    f3error:{
                        e1: 'Escoja una fecha',
                    },
                    button1: 'Limpiar',
                    button2: 'Buscar'

                }
            },
            aircraft:{
                tabs:{
                    tab1: 'Agregar',
                    tab2: 'Gestionar'
                },
                card1:{
                    headline:'Agregue aeronave',
                    title: 'Nueva aeronave',
                },
                dialog:{
                    headline:'Aeronave ',
                    card2:{
                        title: 'Actualizar aeronave',
                    },
                },
                datatable:{
                    placeholder: 'Buscar',
                    title: 'Transacciones',
                    f1: 'Nombre',
                    f2: 'Modelo',
                    f3: 'MTOW',
                    f4: 'Estatus',
                    f5: 'Editar',
                    f6: 'Borrar',
                },
                form1:{
                    f1:'Aeronaves',
                    f1error:{
                        e1: 'Escoja una aeronave'
                    },
                    f2:'Número de cola',
                    f2error:{
                        e1: 'El número de cola es requerido',
                        e2: 'Espacios en blanco y simbolos no estan permitidos en este campo'
                    },
                    f3:'Tipo de aviación',
                    f3error:{
                        e1: 'Escoja un tipo de aviación',
                    },
                    f4:'Nombre',
                    f4error:{
                        e1: 'Escoja un nombre para su aeronave',
                    },
                    f5: 'Habilitar aeronave',
                    f5label:{
                        l1:'Activa',
                        l2:'Inactiva',
                        l3: 'Habilitar'
                    },
                    button1: 'Limpiar',
                    button2: 'Guardar',
                    button3: 'Actualizar'

                },
                module:{
                    sms1: 'Actualización satisfactoria',
                    sms2: 'Error en la operación, la actualización no fue completada ',
                    sms3: 'Aeronave creada satisfactoriamente',
                    sms4: 'Borrar aeronave',
                    sms5: 'Por favor confirme que desea borrar esta aeronave.',
                    btn1: 'Cancelar',
                    btn2: 'Borrar',
                    sms6: 'Error en la operación, la eliminación no se completó ',
                    sms7: 'Aeronave, borrada satisfactoriamente',
                    sms8: 'Rechazado'
                }
            },
            adminPending:{
                tabs:{
                    tab1: 'Ordenes Abiertas',
                    tab2: 'Ordenes cerradas'
                },
                card1:{
                    headline:'Adminstración de peticiones de servicios',
                },
                card2:{
                    headline:'Ordenes cerradas',
                },
                dialog:{
                    headline:'Peticiones de servicios',
                    label1: 'Cliente',
                    label2: 'Localidad',
                    label3: 'Fecha de aterrizaje',
                    datatable1:{
                        title: 'Servicios',
                        f1: 'Seleccionar',
                        f2: 'Info',
                        f3: 'Unidad',
                        f4: 'Precio',
                        f5: 'Monto',
                    }
                },

                datatable1:{
                    placeholder: 'Buscar',
                    title: 'Peticiones de servicios pendientes',
                    f1: 'Cliente',
                    f2: 'Localidad',
                    f3: 'Fecha de creación',
                    f4: 'Fecha de aterrizaje',
                    f5: 'Serial',
                    f6: 'Validar',
                    f7: 'Preparar',
                    f8: 'Reversar'
                },
                datatable2:{
                    placeholder: 'Buscar',
                    title: 'Ordenes cerradas',
                    f1: 'Cliente',
                    f2: 'Localidad',
                    f3: 'Fecha de creación',
                    f4: 'Fecha de aterrizaje',
                    f5: 'Serial',
                },
                form1:{
                    f1:'Ticket',
                    f1error:{
                        e1: 'El número de ticket es requerido'
                    },
                    f2:'Monto',
                    button1: 'Cerrar',
                    button2: 'Generar Ticket',

                },
                module:{
                    sms1: 'Crear Ticket',
                    sms2: 'Por favor confirme que desea crear este ticket, ESTA OPERACIÓN NO PUEDE SER REVERSADA.',
                    btn1: 'Cancelar',
                    btn2: 'Crear Ticket',
                    sms3: 'Ticket creado satisfactoriamente',
                    sms4: 'Rechazado',
                    sms5: 'Validar petición de servicio',
                    sms6: 'Informar al cliente que su orden ha sido validada y sera atendido en la localidad acordada',
                    btn3: 'Cancelar',
                    btn4: 'Validar',
                    sms7: 'Petición de servicio validada satisfactoriamente',
                    sms8: 'Acción cancelada',
                    sms9: 'Error en la operación'


                }
            },
            products:{
                tabs:{
                    tab1: 'Nuevo Producto',
                    tab2: 'Manage'
                },
                card1:{
                    headline:'Nuevo Producto',
                    title: 'Precio'
                },
                card2:{
                    title:'Precio',
                },
                dialog:{
                    card1:{
                        headline:'Bank Accounts ',
                        title:'Edit bank account',
                    },
                },
                form1:{
                    f1:'Nombre del producto',
                    f1error:{
                        e1: 'Introduce el Nombre del Producto'
                    },
                    f2:'Descripción del Producto',
                    f2error:{
                        e1: 'Introduce la Descripción del Producto'
                    },
                    f3:'Medida de unidad',
                    f3error:{
                        e1: 'Introduce la Medida de unidad'
                    },
                    f4:'Descripción de medida de unidad',
                    f4error:{
                        e1: 'Introduce la Descripción de medida de unidad'
                    },
                    f5:'Producto habilitado',
                    f5label: 'Habilitado',
                    f6:'Tipo de precio',
                    f6error:{
                        e1: 'Escoge el tipo de Precio'
                    },
                    f7:'Localidades',
                    f7error:{
                        e1: 'Escoja una localidad'
                    },
                    f8:'Tipo de aviación',
                    f8error:{
                        e1: 'Escoja el tpo de aviación'
                    },
                    f9:'Nombre del precio',
                    f9error:{
                        e1: 'Introduce el nombre del precio'
                    },
                    f10:'Prepago',
                    f10label:'Enabled',
                    f11:'Valido hasta',
                    f11error:{
                        e1: 'Es necesario que llene este campo'
                    },
                    f12:'Libras desde',
                    f12error:{
                        e1: 'Introduce el rango de libras'
                    },
                    f13:'Libras hasta',
                    f13error:{
                        e1: 'Introduce el rango de libras'
                    },
                    f14:'Fecha desde',
                    f14error:{
                        e1: 'Introduce el rango de fechas'
                    },
                    f15:'Fechas hasta',
                    f15error:{
                        e1: 'Introduce el rango de fechas'
                    },
                    f16:'Moneda',
                    f16error:{
                        e1: 'Escoja una moneda'
                    },
                    f17:'Medida',
                    f17error:{
                        e1: 'Introduzca la medida'
                    },
                    f18:'Unidad',
                    f18error:{
                        e1: 'Introduzca la unidad'
                    },
                    f19:'Descripción de la unidad',
                    f19error:{
                        e1: 'Introduce la descripcion de la unidad'
                    },
                    f20:'Precio',
                    f20error:{
                        e1: 'Introduzca el precio'
                    },
                    f21:'Costo',
                    f21error:{
                        e1: 'Introduce el costo'
                    },
                    f22:'Diferencial',
                    f22error:{
                        e1: 'Introduzca el diferencial'
                    },
                    f23:'¿Es esto un impuesto?',
                    f23label:'Habilitado',
                    button1: 'Limpiar',
                    button2: 'Crear',
                    //button3: 'Update',

                },
                module:{
                    sms1: 'Su producto fue creado satisfactoriamente!!!',
                }
            },
            menu: {
                usermenu: {
                    opt1: 'Registro',
                    opt2: 'Logueo',
                    tooltip: 'Usuario'
                },
                useradmin: {
                    opt1: 'Gestionar Usuarios',
                    tooltip: 'Gestionar Usuarios'
                },
                jdcard: {
                    opt1: 'Compra ',
                    opt2: 'Recarga ',
                    tooltip: 'Gestionar'
                },
                giftcard: {
                    opt1: 'Comprar tarjeta de regalo',
                    opt2: 'Reclamar tarjeta de regalo',
                    tooltip: 'Tarjeta de regalo'
                },
                payments: {
                    opt1: 'Agregar método de pago',
                    opt2: 'Notificar depósito / Transferencia',
                    tooltip: 'Cartera'
                },
                bankmanage: {
                    opt1: 'Gestionar cuenta bancaria',
                    opt2: 'Validar pago',
                    tooltip: 'Gestionar pagos'
                },
                defgen: {
                    opt1: 'Productos',
                    tooltip: 'Configuración'
                },
                aircraft: {
                    opt1: 'Mis aeronaves',
                    tooltip: 'Mis aeronaves'
                },
                captain: {
                    opt1: 'Mis pilotos',
                    tooltip: 'Mis pilotos'
                },
                cardvalidate: {
                    opt1: 'Validador',
                    tooltip: 'Validar tarjeta'
                },
                balance: {
                    opt1: 'Detalles de balance',
                    tooltip: 'Balance'
                },
                servrequest: {
                    opt1: 'Peticiones de servicio pendientes',
                    opt2: 'Administrar peticiones de servicio',
                    tooltip: 'Ordenes'
                },
                cart:{
                    opt1: 'Carro de compra',
                    tooltip: 'Carro de compra'
                },
                mainmenu: {
                    opt1: 'Home',
                    opt2: 'Contactos',
                    opt2link: 'http://jdoilfield.com/es/?page_id=72'
                },
                module: {
                    sms1: 'Crear tarjeta de coordenadas',
                    sms2: '¿Necesitas una nueva tarjeta de coordenadas?',
                    btn1: 'Cancelar',
                    btn2: 'Crear',
                    sms3: 'Tarjeta creada satisfactoriamente, verifique su correo para las instrucciones de activación',
                    sms4: 'Su operación ha sido cancelada',
                    sms5: 'Saldo insuficiente',
                    sms6: 'Escoja otro método de pago o recargue su ',
                    sms7: 'para cancelar su peticiones de servicio',
                    sms8: 'Su petición de servicio ha sido creado satisfactoriamente, atención al cliente lo contactara tan pronto su petición haya sdo validada.',
                    sms9: 'Eliminar elemento del carro de compra',
                    sms10: 'Por favor confirme que desea eliminar este elemento ',
                    btn3: 'Cancelar',
                    btn4: 'Borrar',
                    sms11: 'El elemento ha sido borrado ',
                    sms12: 'La operación ha sido cancelada',
                    sms13: 'Eliminar carro de compra',
                    sms14: 'Por favor confirme que desea eliminar este carro de compra ',
                    btn5: 'Cancelar',
                    btn6: 'Borrar',
                    sms17: 'El carro de compra ha sido eliminado ',
                    sms18: 'La operación ha sido cancelada',
                }
            }
        });
        $translateProvider.preferredLanguage('en');
        $translateProvider.useCookieStorage();
        //$translateProvider.useLocalStorage();
        $translateProvider.useSanitizeValueStrategy('escape');
    }
]);