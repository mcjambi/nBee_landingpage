import React from 'react';
import 'media/css/bankCardTemplate.scss';

import masterCardLogo from 'media/images/bank_card_mastercard_logo.png';
import visaLogo from 'media/images/bank_card_visa_logo.svg';
import unknownLogo from 'media/images/bank_card_unknown_logo.svg';
import chipp from 'media/images/bank_card_chip.png';
import __helpers from 'helpers/index';
import __ from 'languages/index';

function detectCardType(cardNumber: any) {
  // Loại bỏ khoảng trắng, nếu có
  const cleanedCardNumber = (cardNumber || ' ').replace(/\s+/g, '');

  // Kiểm tra thẻ Visa (bắt đầu bằng số 4)
  if (cleanedCardNumber.startsWith('4')) {
    return 'Visa';
  }

  // Kiểm tra thẻ MasterCard (bắt đầu bằng số từ 51 đến 55 hoặc từ 2221 đến 2720)
  const firstTwoDigits = parseInt(cleanedCardNumber.slice(0, 2), 10);
  const firstFourDigits = parseInt(cleanedCardNumber.slice(0, 4), 10);

  if ((firstTwoDigits >= 51 && firstTwoDigits <= 55) || (firstFourDigits >= 2221 && firstFourDigits <= 2720)) {
    return 'MasterCard';
  }

  // Trả về 'Unknown' nếu không xác định được loại thẻ
  return 'Unknown';
}

/**
 * Display bankcard
 * @returns
 */
export default function BankCard({
  name_of_bank = '',
  account_number = '',
  card_number = 'xxxx xxxx xxxx xxxx',
  name_on_card = 'NGUYEN VAN A',
  valid_date = new Date(),
}: {
  /** Tên ngân hàng */
  name_of_bank?: string;
  /** Số tài khoản */
  account_number?: string;
  /** Hoặc số card */
  card_number: string;
  /** Tên trên tài khoản */
  name_on_card: string;
  /** Tùy chọn, không validate nó ... */
  valid_date?: Date;
}) {
  let logo = '',
    name_of_card = '';

  if (!name_on_card) name_on_card = 'NGUYEN VAN A';

  if (!__helpers.isDate(valid_date)) valid_date = new Date();

  // Xử lý card_number để thêm các placeholder "xxxx"
  let a = __helpers.parseNumeric(card_number);
  let c = String(a || ' ')
    .match(/.{1,4}/g)
    .join(' ');
  const cardNumberParts = c.split(' ');

  const formattedCardNumber = cardNumberParts
    .map((part) => part.padEnd(4, 'x'))
    .concat(Array(4).fill('xxxx'))
    .slice(0, 4)
    .join(' ');

  switch (detectCardType(card_number)) {
    case 'Visa':
      logo = visaLogo;
      name_of_card = 'Visa Card';
      break;
    case 'MasterCard':
      logo = masterCardLogo;
      name_of_card = 'Master Card';
      break;
    default:
      logo = unknownLogo;
      name_of_card = 'UNKNOWN';
  }

  if (!name_of_bank) name_of_bank = name_of_card;

  return (
    <>
      <div className="bank_card_container">
        <header>
          <span className="logo">
            <img src={logo} alt="" />
            <h5>{name_of_bank}</h5>
          </span>
          <img src={chipp} alt="" className="chip" />
        </header>

        <div className="card-details">
          <div className="name-number">
            {account_number ? (
              <>
                <h6>{__('bank_card_account_number_label')}</h6>
                <h5 className="number">{account_number}</h5>
              </>
            ) : (
              <>
                <h6>{__('bank_card_number_label')}</h6>
                <h5 className="number">{formattedCardNumber}</h5>
              </>
            )}
            <h5 className="name">{name_on_card}</h5>
          </div>
        </div>
      </div>
    </>
  );
}
