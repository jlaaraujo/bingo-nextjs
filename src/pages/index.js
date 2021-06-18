import { useState, useEffect } from 'react';
import Head from 'next/head'
import Image from 'next/image'
import styles from './home.module.scss'
import { cardItem } from '../components/CardItem/index';
import { confirmAlert } from 'react-confirm-alert'; // Import
import 'react-confirm-alert/src/react-confirm-alert.css'; // Import css
import BounceLoader from "react-spinners/BounceLoader";

export default function Home() {
  const sizeOfNumbersInRoulette = 75;


  const numbersOfRoulette = Array.from(Array(sizeOfNumbersInRoulette).keys())
  const [drawNumbers, setDrawNumbers] = useState([])
  const [numbersToBeDraw, setNumbersToBeDraw] = useState(numbersOfRoulette);
  const [lastNumberDraw, setLastNumberDraw] = useState(null);
  const [numberIsBeenDrawing, setNumberIsBeenDrawing] = useState(true);

  const random = (min, max) => Math.floor(Math.random() * (max - min)) + min;
  const delay = ms => new Promise(res => setTimeout(res, ms));

  async function drawRandomNumberAvailable(e){
    setNumberIsBeenDrawing(true);
    await delay(3000);

    const arrayPositionDraw = random(0, numbersToBeDraw.length);
    const drawNumber = (numbersToBeDraw[arrayPositionDraw]);
    await setLastNumberDraw(drawNumber);
    const updateDrawedNumbers = [...drawNumbers, drawNumber];
    await setDrawNumbers(updateDrawedNumbers);
    const availableNumbersToDrawn = [...numbersToBeDraw]
    const updateAvailableNumbersToDrawn = availableNumbersToDrawn.filter(item => item !== drawNumber)
    await setNumbersToBeDraw(updateAvailableNumbersToDrawn);
    await updateLocalStorageData(updateDrawedNumbers);

    setNumberIsBeenDrawing(false);
  }

 useEffect(async () => {
    const dataFromLocalStorage = await getLocalStorageData();
    setDrawNumbers(dataFromLocalStorage);
    if(dataFromLocalStorage.length > 0) {
      setLastNumberDraw(([...dataFromLocalStorage].slice(-1))[0]);
    }
  },[]);

  useEffect(() => {
  },[drawNumbers]);

  async function getLocalStorageData(){
    const localStorageData = localStorage.getItem('@bingoRoulette/drawedNumbers');
    if(localStorageData){
      return localStorageData.split(',').map(Number);
    }

    return [];
  }

  async function updateLocalStorageData(updateAvailableNumbersToDrawn){
    // Atualizar LocalStorage
    localStorage.setItem('@bingoRoulette/drawedNumbers', updateAvailableNumbersToDrawn);
  }


  async function confirmRestartDraw(){
    confirmAlert({
      title: 'Bingoooooo',
      message: 'Você confirma que deseja reiniciar o sorteio? Todos os números sorteados até o momento serão excluídos e um novo sorteio será iniciado.',
      buttons: [
        {
          label: 'Sim',
          onClick: () => cleanLocalStorageData()
        },
        {
          label: 'Não',
        }
      ]
    });
  }

  async function cleanLocalStorageData() {
    // Limpar LocalStorage
    localStorage.removeItem('@bingoRoulette/drawedNumbers');
    setDrawNumbers([])
    setNumbersToBeDraw(numbersOfRoulette)
    setLastNumberDraw(null);
  }


  return (
      <div className={styles.contentContainer}>
        <div className={styles.rouletteContainer}>
            <div className={styles.rouletteHeader}>
              <div className={styles.sort}>
                <div className={styles.sortedNumber}>
                  {!numberIsBeenDrawing ? 
                    (lastNumberDraw === null ? '-' : (lastNumberDraw + 1)) 
                    : 
                    (<BounceLoader size={100} color="#d8deff" />)
                  }
                </div>
                <div className={styles.lastDraws}>
                  {
                    ((drawNumbers.slice(-3)).reverse()).map((numberDrawed) =>
                      <div className={styles.lastNumbersDraw} key={`numberDrawed-${numberDrawed}`}>
                        {numberDrawed + 1}
                      </div>
                    )
                  }
                </div>
              </div>

              <div className={styles.buttonsPanel}>
                { drawNumbers.length < sizeOfNumbersInRoulette &&
                  <button onClick={drawRandomNumberAvailable}>Sortear próximo número</button>
                }
                <button onClick={confirmRestartDraw}>Reiniciar sorteio</button>
              </div>


            </div>
            <div className={styles.rouletteCardNumbers}>
                {
                  numbersOfRoulette.map((number) =>
                    <div key={`numbersOfRoulette-${number}`}>
                      {cardItem(number, drawNumbers.includes(number))}
                    </div>
                  )
                }
            </div>
        </div>
      </div>
  )
}
