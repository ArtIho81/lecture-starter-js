import createElement from '../../helpers/domHelper';
import showModal from './modal';

export default function showWinnerModal(fighter) {
    // call showModal function
    const bodyElement = createElement({
        tagName: 'h1',
        className: 'winner'
    });
    bodyElement.innerHTML = `${fighter?.name}`;
    showModal({
        title: 'winner',
        bodyElement
    });
}
